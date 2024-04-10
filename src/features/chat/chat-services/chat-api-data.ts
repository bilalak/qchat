import { ChatCompletionMessageParam } from "openai/resources"

import { AzureCogDocumentIndex, similaritySearchVectorWithScore } from "./azure-cog-search/azure-cog-vector-store"
import { DocumentSearchModel } from "./azure-cog-search/azure-cog-vector-store"
import { ChatAPI } from "./chat-api"
import { InitChatSessionResponse } from "./chat-thread-service"

import { getTenantId, userHashedId } from "@/features/auth/helpers"
import { ChatRole } from "@/features/chat/models"
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

export const ChatAPIData = async (chatInitResponse: InitChatSessionResponse): Promise<Response> => {
  const { chatThread, updatedLastHumanMessage } = chatInitResponse

  const relevantDocuments = await findRelevantDocuments(updatedLastHumanMessage.content, chatThread.id)
  const context = relevantDocuments
    .map((result, index) => {
      const content = result.pageContent.replace(/(\r\n|\n|\r)/gm, "")
      const context = `[${index}]. file name: ${result.metadata} \n file id: ${result.id} \n order: ${result.order} \n ${content}`
      return context
    })
    .join("\n------\n")

  const userMessage: ChatCompletionMessageParam = {
    role: ChatRole.System,
    content: CONTEXT_PROMPT({
      context,
      userQuestion: updatedLastHumanMessage.content,
    }),
  }

  return await ChatAPI(SYSTEM_PROMPT, userMessage, chatThread, updatedLastHumanMessage, translate)
}

// TODO: https://dis-qgcdg.atlassian.net/browse/QGGPT-437
const translate = async (input: string): Promise<string> => await Promise.resolve(input)

const findRelevantDocuments = async (
  query: string,
  chatThreadId: string
): Promise<(AzureCogDocumentIndex & DocumentSearchModel)[]> => {
  const [userId, tenantId] = await Promise.all([userHashedId(), getTenantId()])
  const relevantDocuments = await similaritySearchVectorWithScore(query, 10, userId, chatThreadId, tenantId)
  return relevantDocuments
}
