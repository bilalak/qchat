import { ChatCompletionMessageParam } from "openai/resources"

import { ChatAPI } from "./chat-api"
import { InitChatSessionResponse } from "./chat-thread-service"
import { translator } from "./chat-translator-service"

import { userSession } from "@/features/auth/helpers"
import { ChatRole } from "@/features/chat/models"

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

async function buildFullMetaPrompt(): Promise<string> {
  const userContextPrompt = await buildUserContextPrompt()
  const systemPrompt = getSystemPrompt()
  return systemPrompt + userContextPrompt
}

const translate = async (input: string): Promise<string> => {
  const translatedCompletion = await translator(input)
  return translatedCompletion.status === "OK" ? translatedCompletion.response : ""
}

export const ChatAPISimple = async (chatInitResponse: InitChatSessionResponse): Promise<Response> => {
  const { chatThread, updatedLastHumanMessage } = chatInitResponse

  const userMessage: ChatCompletionMessageParam = {
    role: ChatRole.System,
    content: updatedLastHumanMessage.content,
  }

  const metaPrompt = await buildFullMetaPrompt()
  return await ChatAPI(metaPrompt, userMessage, chatThread, updatedLastHumanMessage, translate)
}
