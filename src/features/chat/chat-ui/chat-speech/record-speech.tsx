import { Mic } from "lucide-react"
import { FC } from "react"

import { useChatContext } from "@/features/chat/chat-ui/chat-context"
import { Button } from "@/features/ui/button"

interface Prop {
  disabled: boolean
}

export const RecordSpeech: FC<Prop> = props => {
  const { speech } = useChatContext()
  const { startRecognition, stopRecognition, isMicrophonePressed } = speech

  const handleMouseDown = async (): Promise<void> => {
    await startRecognition()
  }

  const handleMouseUp = (): void => {
    stopRecognition()
  }

  return (
    <Button
      type="button"
      size="icon"
      variant={"ghost"}
      disabled={props.disabled}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={isMicrophonePressed ? "bg-red-400 hover:bg-red-400" : ""}
    >
      <Mic size={18} />
    </Button>
  )
}
