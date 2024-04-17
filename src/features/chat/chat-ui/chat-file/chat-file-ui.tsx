import { ArrowUpCircle, Loader2 } from "lucide-react"
import { FC, useEffect, useRef } from "react"

import { useFileSelection } from "./use-file-selection"

import { useChatContext } from "@/features/chat/chat-ui/chat-context"
import { OffenderTranscriptForm } from "@/features/chat/chat-ui/chat-empty-state/chat-transcript-details"
import { Button } from "@/features/ui/button"
import { Input } from "@/features/ui/input"

export const ChatFileUI: FC = () => {
  const { id, fileState, chatBody, offenderId } = useChatContext()
  const { isFileNull, setIsFileNull, uploadButtonLabel, isUploadingFile } = fileState
  const { onSubmit } = useFileSelection({ id })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getAcceptedFileType = (chatType: string): string => {
    switch (chatType) {
      case "data":
        return ".pdf"
      case "audio":
        return ".wav"
      default:
        return ""
    }
  }

  const acceptedFileType = getAcceptedFileType(chatBody.chatType)

  useEffect(() => {
    if (isFileNull && fileInputRef.current) {
      fileInputRef.current.value = fileInputRef.current.defaultValue
    }
  }, [isFileNull])

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={onSubmit} className="flex gap-2">
        <label htmlFor="file-upload" className="sr-only">
          Upload File
        </label>
        <Input
          ref={fileInputRef}
          id="file-upload"
          name={fileState.showFileUpload}
          type="file"
          required
          disabled={isUploadingFile}
          accept={acceptedFileType}
          aria-describedby="file-upload-description"
          onChange={e => {
            const files = e.currentTarget.files
            if (files) {
              setIsFileNull(files.length === 0)
            }
          }}
          className="file-input-class"
        />
        <Button
          type="submit"
          disabled={!(!isFileNull && !isUploadingFile)}
          className="flex items-center gap-1"
          aria-disabled={isUploadingFile ? "true" : undefined}
        >
          {isUploadingFile ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" size={20} />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <ArrowUpCircle aria-hidden="true" size={20} />
              Upload
            </>
          )}
        </Button>
      </form>
      <p id="file-upload-description" className="text-sm text-muted-foreground">
        {uploadButtonLabel ||
          "Select a file to upload, please note files are not stored in their original format and may be cleared from the system after thirty days."}
      </p>
      {chatBody.chatType === "audio" && offenderId != null && (
        <div>
          <OffenderTranscriptForm chatThreadId={id} />
        </div>
      )}
    </div>
  )
}
