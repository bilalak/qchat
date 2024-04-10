import { ChatAPIData } from "./chat-api-data"
import { ChatAPISimple } from "./chat-api-simple"
import { InitChatSession } from "./chat-thread-service"

import { PromptGPTProps } from "@/features/chat/models"

const dataChatTypes = ["data", "mssql", "audio"]

export const ChatAPIEntry = async (props: PromptGPTProps): Promise<Response> => {
  try {
    const chatResponse = await InitChatSession(props)
    if (chatResponse.status !== "OK") throw chatResponse

    if (props.chatType === "simple" || !dataChatTypes.includes(props.chatType)) {
      return await ChatAPISimple(chatResponse.response)
    } else {
      return await ChatAPIData(chatResponse.response)
    }
  } catch (error) {
    const errorResponse = error instanceof Error ? error.message : "An unknown error occurred."
    const errorStatusText = error instanceof Error ? error.toString() : "Unknown Error"

    return new Response(errorResponse, {
      status: 500,
      statusText: errorStatusText,
    })
  }
}
