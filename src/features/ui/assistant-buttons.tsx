"use client"

import React from "react"
import { Button } from "./button"
import { CheckIcon, ClipboardIcon, ThumbsUp, ThumbsDown, Languages } from "lucide-react"
import { useWindowSize } from "./windowsize"
import { TooltipProvider } from "@/features/ui/tooltip-provider"
import * as Tooltip from "@radix-ui/react-tooltip"

interface AssistantButtonsProps {
  isIconChecked: boolean
  thumbsUpClicked: boolean
  thumbsDownClicked: boolean
  handleTranslationIconClick: () => void
  handleCopyButton: () => void
  handleThumbsUpClick: () => void
  handleThumbsDownClick: () => void
}

export const AssistantButtons: React.FC<AssistantButtonsProps> = ({
  isIconChecked,
  thumbsUpClicked,
  thumbsDownClicked,
  handleTranslationIconClick,
  handleCopyButton,
  handleThumbsUpClick,
  handleThumbsDownClick,
}) => {
  const { width } = useWindowSize()
  let iconSize = 10
  let buttonClass = "h-9"

  if (width < 768) {
    buttonClass = "h-7"
  } else if (width >= 768 && width < 1024) {
    iconSize = 12
  } else if (width >= 1024) {
    iconSize = 16
  }

  return (
    <div className="container flex w-full gap-4 p-2">
      <Button
        aria-label="Copy text"
        variant={"ghost"}
        size={"default"}
        className={buttonClass}
        title="Copy text"
        onClick={handleCopyButton}
      >
        {isIconChecked ? <CheckIcon size={iconSize} /> : <ClipboardIcon size={iconSize} />}
      </Button>

      <Button
        variant={"ghost"}
        size={"default"}
        className={buttonClass}
        title="Thumbs up"
        onClick={handleThumbsUpClick}
        aria-label="Provide positive feedback"
      >
        {thumbsUpClicked ? <CheckIcon size={iconSize} /> : <ThumbsUp size={iconSize} />}
      </Button>

      <Button
        variant={"ghost"}
        size={"default"}
        className={buttonClass}
        title="Thumbs down"
        onClick={handleThumbsDownClick}
        aria-label="Provide negative feedback"
      >
        {thumbsDownClicked ? <CheckIcon size={iconSize} /> : <ThumbsDown size={iconSize} />}
      </Button>
      <TooltipProvider>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <span onClick={handleTranslationIconClick} className={buttonClass}>
              <Languages />
            </span>
          </Tooltip.Trigger>
          <Tooltip.Content
            side="bottom"
            className="bg-primary-foreground text-foreground rounded-md p-2 text-sm shadow-lg"
          >
            <p>
              <strong>Translator:</strong> By clicking on this icon, you are requesting to traslate all words in the
              QChat response into Australian English.
            </p>
          </Tooltip.Content>
        </Tooltip.Root>
      </TooltipProvider>
    </div>
  )
}

export default AssistantButtons
