import React, { FC } from "react"

import Typography from "@/components/typography"

import { Button } from "./button"

interface ModalProps {
  chatThreadId: string
  chatMessageId: string
  rewriteAction: "Simplify" | "Improve" | "Explain"
  message: string
  open: boolean
  onClose: () => void
  onSubmit: () => void
}

export default function RewriteMessageModal(props: ModalProps): ReturnType<FC> {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rewriteMessageHeading"
      className={`fixed inset-0 z-90 flex items-center justify-center bg-black/50 ${props.open ? "block" : "hidden"}`}
    >
      <div className="z-90 mx-auto w-full max-w-lg overflow-hidden rounded-lg bg-background p-4">
        <div className="mb-4">
          <Typography id="rewriteMessageHeading" variant="h4">
            {props.rewriteAction} message
          </Typography>
        </div>
        <div className="mb-4">
          <textarea
            name={props.chatMessageId + "Rewrite text"}
            id={props.chatMessageId + "Rewrite text id"}
            aria-label="Enter your feedback"
            placeholder=""
            defaultValue={rewriteTexts(props.rewriteAction, props.message)}
            rows={15}
            className="flex min-h-[80px] w-full rounded-md border border-gray-300 border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            // value={rewriteTexts(props.rewriteAction, props.message)}
            // onChange={event => event.target.value}
          />
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="default" onClick={props.onSubmit} disabled={false}>
            {props.rewriteAction}
          </Button>
          <Button variant="destructive" onClick={props.onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

const rewriteTexts = (action: ModalProps["rewriteAction"], message: string): string => {
  switch (action) {
    case "Simplify":
      return `Simplify the text below, consider length, readability and tone of voice:\n\n===Text to simplify===\n${message}\n===End of text to simplify===`
    case "Improve":
      return `Improve the text below, consider inclusive language, length, readability and tone of voice:\n\n===Text to improve===\n${message}\n===End of text to improve===`
    case "Explain":
      return `Explain why the text below is not in line with our safety or ethical checks:\n\n===Text to reword===\n${message}\n===End of text to reword===`
    default:
      return "Unknown action"
  }
}
