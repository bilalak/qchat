import Markdoc from "@markdoc/markdoc"
import React, { FC } from "react"

import { CodeBlock } from "./code-block"
import { citationConfig } from "./config"
import { Paragraph } from "./paragraph"

import { Citation } from "@/features/chat/chat-ui/markdown/citation"

interface Props {
  content: string
}

export const Markdown: FC<Props> = props => {
  const ast = Markdoc.parse(props.content)

  const content = Markdoc.transform(ast, {
    ...citationConfig,
  })

  return (
    <>
      {Markdoc.renderers.react(content, React, {
        components: { Citation, Paragraph, CodeBlock },
      })}
    </>
  )
}
