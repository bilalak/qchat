import { JSONValue, Message, OpenAIStream, StreamingTextResponse, experimental_StreamData } from "ai"
import { APIError } from "openai"
import { ChatCompletionChunk } from "openai/resources"
import { Completion } from "openai/resources/completions"

import {
  UpsertChatMessage,
  ChatCompletionMessageTranslated,
  FindTopChatMessagesForCurrentUser,
} from "./chat-message-service"
import { InitChatSession } from "./chat-thread-service"
import { translator } from "./chat-translator-service"
import { UpdateChatThreadIfUncategorised } from "./chat-utility"

import { userSession } from "@/features/auth/helpers"
import { PromptGPTProps, ChatRole, CreateCompletionMessage, ContentFilterResult } from "@/features/chat/models"
import { mapOpenAIChatMessages } from "@/features/common/mapping-helper"
import { OpenAIInstance } from "@/features/common/services/open-ai"

async function buildUserContextPrompt(): Promise<string> {
  const session = await userSession()
  const displayName = session?.name
  const contextPrompt = session?.contextPrompt
  if (!displayName) return ""
  let prompt = `\nNote, you are chatting to ${displayName}`
  if (contextPrompt && contextPrompt.length > 0) {
    prompt += ` and they have provided the below context:\n${contextPrompt}\n`
  }
  return prompt
}

function getSystemPrompt(): string {
  return (
    process.env.SYSTEM_PROMPT ||
    `-You are QChat who is a helpful AI Assistant developed to assist Queensland government employees in their day-to-day tasks.
    - You will provide clear and concise queries, and you will respond with polite and professional answers.
    - You will answer questions truthfully and accurately.
    - You will respond to questions in accordance with rules of Queensland government.`
  )
}

export async function buildFullMetaPrompt(): Promise<string> {
  const userContextPrompt = await buildUserContextPrompt()
  const systemPrompt = getSystemPrompt()
  return systemPrompt + userContextPrompt
}

export const ChatAPISimple = async (props: PromptGPTProps): Promise<Response> => {
  try {
    const chatResponse = await InitChatSession(props)
    if (chatResponse.status !== "OK") throw chatResponse
    const metaPrompt = await buildFullMetaPrompt()

    const { chatThread, updatedLastHumanMessage } = chatResponse.response
    const openAI = OpenAIInstance()

    const historyResponse = await FindTopChatMessagesForCurrentUser(chatThread.id)
    if (historyResponse.status !== "OK") throw historyResponse

    let contentFilterCount = Math.max(
      ...[...historyResponse.response.map(message => message.contentFilterCount ?? 0), 0]
    )

    const addMessageResponse = await UpsertChatMessage(
      chatThread.id,
      {
        content: updatedLastHumanMessage.content,
        role: "user",
        contentFilterCount,
      },
      updatedLastHumanMessage.id
    )
    if (addMessageResponse.status !== "OK") throw addMessageResponse

    const data = new experimental_StreamData()

    let response
    try {
      response =
        contentFilterCount >= maxSafetyTriggersAllowed
          ? makeContentFilterResponse(true)
          : await openAI.chat.completions.create({
            messages: [
              {
                role: ChatRole.System,
                content: metaPrompt,
              },
              ...mapOpenAIChatMessages([...historyResponse.response, addMessageResponse.response]),
            ],
            model: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
            stream: true,
          })
    } catch (exception) {
      if (exception instanceof APIError && exception.status === 400 && exception.code === "content_filter") {
        const contentFilterResult = exception.error as ContentFilterResult
        contentFilterCount++

        await UpsertChatMessage(
          chatThread.id,
          {
            ...addMessageResponse.response,
            contentFilterResult,
            contentFilterCount,
          },
          updatedLastHumanMessage.id
        )

        data.append({
          id: addMessageResponse.response.id,
          content: addMessageResponse.response.content,
          contentFilterResult,
          contentFilterCount,
        } as DataItem)

        response = makeContentFilterResponse(contentFilterCount >= maxSafetyTriggersAllowed)
      } else {
        throw exception
      }
    }

    const stream = OpenAIStream(response as AsyncIterable<Completion>, {
      async onCompletion(completion: string) {
        const translatedCompletion = await translator(completion)
        const message = buildAssistantChatMessage(
          completion,
          translatedCompletion.status === "OK" ? translatedCompletion.response : ""
        )

        const completionMessage = updatedLastHumanMessage as typeof updatedLastHumanMessage & CreateCompletionMessage
        const addedMessage = await UpsertChatMessage(chatThread.id, message, completionMessage.completion_id)
        if (addedMessage?.status !== "OK") {
          throw addedMessage.errors
        }

        data.append({
          id: addedMessage.response.id,
          content: addedMessage.response.content,
        } as DataItem)

        message.content && (await UpdateChatThreadIfUncategorised(chatThread, message.content))
      },
      async onFinal() {
        await data.close()
      },
      experimental_streamData: true,
    })

    return new StreamingTextResponse(
      stream,
      {
        headers: { "Content-Type": "text/event-stream" },
      },
      data
    )
  } catch (e: unknown) {
    const errorResponse = e instanceof Error ? e.message : "An unknown error occurred."
    const errorStatusText = e instanceof Error ? e.toString() : "Unknown Error"

    return new Response(errorResponse, {
      status: 500,
      statusText: errorStatusText,
    })
  }
}

export type DataItem = JSONValue &
  Message & {
    contentFilterResult?: ContentFilterResult
    contentFilterCount: number
  }

export const buildAssistantChatMessage = (completion: string, translate: string): ChatCompletionMessageTranslated => {
  if (translate)
    return {
      originalCompletion: completion,
      content: translate,
      role: "assistant",
    }
  return {
    content: completion,
    role: "assistant",
  }
}

export const maxSafetyTriggersAllowed = 3

export async function* makeContentFilterResponse(lockChatThread: boolean): AsyncGenerator<ChatCompletionChunk> {
  yield {
    choices: [
      {
        delta: {
          content: lockChatThread
            ? "I'm sorry, but this chat is now locked after multiple safety concerns. We can't proceed with more messages. Please start a new chat."
            : "I'm sorry I wasn't able to respond to that message, could you try rephrasing, using different language or starting a new chat if this persists.",
        },
        finish_reason: "stop",
        index: 0,
      },
    ],
    created: Math.round(Date.now() / 1000),
    id: `chatcmpl-${Date.now()}`,
    model: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
    object: "chat.completion.chunk",
  }
}
