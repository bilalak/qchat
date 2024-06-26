"use client"
import { useEffect } from "react"
import { useFormState } from "react-dom"

import { UpdateIndicatorAction } from "./version-action"

export const UpdateIndicator = (): JSX.Element => {
  const [node, formAction] = useFormState(UpdateIndicatorAction, null)

  useEffect(() => {
    formAction()
  }, [formAction])

  return <>{node}</>
}
