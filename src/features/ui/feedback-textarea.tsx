import * as React from "react"

import { cn } from "@/lib/utils"

export interface FeedbackTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const FeedbackTextarea = React.forwardRef<HTMLTextAreaElement, FeedbackTextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
FeedbackTextarea.displayName = "FeedbackTextarea"

export { FeedbackTextarea }
