import { OpenAIStream, StreamingTextResponse, experimental_StreamData } from "ai"
import { APIError } from "openai"
import { Completion } from "openai/resources/completions"

import { AzureCogDocumentIndex, similaritySearchVectorWithScore } from "./azure-cog-search/azure-cog-vector-store"
import { DocumentSearchModel } from "./azure-cog-search/azure-cog-vector-store"
import {
  DataItem,
  buildAssistantChatMessage,
  makeContentFilterResponse,
  maxSafetyTriggersAllowed,
} from "./chat-api-simple"
import { FindTopChatMessagesForCurrentUser, UpsertChatMessage } from "./chat-message-service"
import { InitChatSession } from "./chat-thread-service"
import { UpdateChatThreadIfUncategorised } from "./chat-utility"

import { getTenantId, userHashedId } from "@/features/auth/helpers"
import { ContentFilterResult, CreateCompletionMessage, PromptGPTProps } from "@/features/chat/models"
import { mapOpenAIChatMessages } from "@/features/common/mapping-helper"
import { OpenAIInstance } from "@/features/common/services/open-ai"
import { AI_NAME } from "@/features/theme/theme-config"

const SYSTEM_PROMPT = `You are ${AI_NAME} who is a helpful AI Assistant.`
const CONTEXT_PROMPT = ({ context, userQuestion }: { context: string; userQuestion: string }): string => {
  return `
- Given the following extracted parts of a document, create a final answer. \n
- If you don't know the answer, just say that you don't know. Don't try to make up an answer.\n
- You must always include a citation at the end of your answer and don't include full stop.\n
- Use the format for your citation {% citation items=[{name:"filename 1", id:"file id", order:"1"}, {name:"filename 2", id:"file id", order:"2"}] /%}\n
----------------\n
context:\n
${context}
----------------\n
question: ${userQuestion}`
}

export const ChatAPIData = async (props: PromptGPTProps): Promise<Response> => {
  try {
    const chatResponse = await InitChatSession(props)
    if (chatResponse.status !== "OK") throw chatResponse
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

    const relevantDocuments = await findRelevantDocuments(updatedLastHumanMessage.content, chatThread.id)
    const context = relevantDocuments
      .map((result, index) => {
        const content = result.pageContent.replace(/(\r\n|\n|\r)/gm, "")
        const context = `[${index}]. file name: ${result.metadata} \n file id: ${result.id} \n order: ${result.order} \n ${content}`
        return context
      })
      .join("\n------\n")

    const data = new experimental_StreamData()

    let response
    try {
      response = await openAI.chat.completions.create({
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          ...mapOpenAIChatMessages(historyResponse.response),
          {
            role: "user",
            content: CONTEXT_PROMPT({
              context,
              userQuestion: updatedLastHumanMessage.content,
            }),
          },
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
      async onCompletion(completion) {
        // TODO: https://dis-qgcdg.atlassian.net/browse/QGGPT-437
        const message = buildAssistantChatMessage(completion, "")

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
    if (e instanceof Error) {
      return new Response(e.message, {
        status: 500,
        statusText: e.toString(),
      })
    } else {
      return new Response("An unknown error occurred.", {
        status: 500,
        statusText: "Unknown Error",
      })
    }
  }
}

const findRelevantDocuments = async (
  query: string,
  chatThreadId: string
): Promise<(AzureCogDocumentIndex & DocumentSearchModel)[]> => {
  const [userId, tenantId] = await Promise.all([userHashedId(), getTenantId()])
  const relevantDocuments = await similaritySearchVectorWithScore(query, 10, userId, chatThreadId, tenantId)
  return relevantDocuments
}
