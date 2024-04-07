import { Config } from "@markdoc/markdoc"

import { fence } from "./code-block"
import { paragraph } from "./paragraph"

import { citation } from "@/features/chat/chat-ui/markdown/citation"

export const citationConfig: Config = {
  nodes: {
    paragraph,
    fence,
  },
  tags: {
    citation,
  },
}
