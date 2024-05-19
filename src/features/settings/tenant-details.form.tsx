"use client"

import * as Form from "@radix-ui/react-form"
import React, { useState, FormEvent, useEffect } from "react"

import { Markdown } from "@/components/markdown/markdown"
import Typography from "@/components/typography"
import { showError, showSuccess } from "@/features/globals/global-message-store"
import { TenantDetails } from "@/features/tenant-management/models"
import SystemPrompt from "@/features/theme/readable-systemprompt"
import { Button } from "@/features/ui/button"
import { CardSkeleton } from "@/features/ui/card-skeleton"

interface PromptFormProps {}

export const TenantDetailsForm: React.FC<PromptFormProps> = () => {
  const [tenant, setTenant] = useState<TenantDetails>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverErrors, setServerErrors] = useState({ contextPrompt: false })
  const [isLoading, setIsLoading] = useState(true)
  const [contextPrompt, setContextPrompt] = useState("")

  useEffect(() => {
    async function fetchDetails(): Promise<TenantDetails> {
      const res = await fetch("/api/tenant/details", { method: "GET" })
      return (await res.json()).data as TenantDetails
    }
    fetchDetails()
      .then(res => {
        setTenant(res)
        setContextPrompt(res.preferences.contextPrompt)
      })
      .catch(err => {
        console.error("Failed to fetch tenant preferences:", err)
        showError("Tenant settings couldn't be loaded, please try again.")
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    const newContextPrompt = new FormData(e.currentTarget).get("contextPrompt") as string

    setIsSubmitting(true)
    setServerErrors({ contextPrompt: false })

    const temp = tenant?.preferences.contextPrompt || ""
    setContextPrompt(newContextPrompt)

    const response = await fetch("/api/tenant/details", {
      method: "POST",
      body: JSON.stringify({
        contextPrompt: newContextPrompt,
      }),
    })
    if (!response.ok) {
      showError("Context prompt could not be updated. Please try again later.")
      setContextPrompt(temp)
    } else {
      showSuccess({ title: "Success", description: "Context prompt updated successfully!" })
      ;(e.target as HTMLFormElement)?.reset()
    }

    setIsSubmitting(false)
  }

  return (
    <Form.Root className="grid size-full w-full grid-cols-1 gap-8 pt-5 md:grid-cols-2" onSubmit={handleSubmit}>
      <div className="mb-4">
        <Typography variant="h4" className="font-bold underline underline-offset-2">
          Department Information
        </Typography>
        <Typography variant="h5" className="mt-2">
          <strong>Notice:</strong> Updating the context prompt here will append the message to the global system
          message. This setting is regularly audited by the Queensland Government AI Unit.
        </Typography>
        <Typography variant="h5">Current Prompt:</Typography>
        <div className="mt-2 rounded-md border-2 p-2">
          {isLoading ? <CardSkeleton /> : <Markdown content={contextPrompt || "Not set"} />}
        </div>
        <Form.Field className="mb-4 mt-2" name="contextPrompt" serverInvalid={serverErrors.contextPrompt}>
          <Form.Label htmlFor="contextPrompt" className="block">
            New Context Prompt:
          </Form.Label>
          <Form.Control asChild>
            <textarea
              id="contextPrompt"
              className="mt-2 w-full rounded-md border-2 p-2"
              placeholder="Enter new context prompt..."
              rows={8}
              maxLength={500}
              required
            />
          </Form.Control>
          {serverErrors.contextPrompt && (
            <Form.Message role="alert" className="text-QLD-alert mt-2">
              Error updating context prompt. Please try again.
            </Form.Message>
          )}
        </Form.Field>
        {!isLoading && (
          <Form.Submit asChild>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </Form.Submit>
        )}
        <Typography variant="p" className="mt-4">
          Current System Prompt: <SystemPrompt />
        </Typography>
      </div>
      <div>
        <Typography variant="h5" className="mb-4">
          Domain:
          {isLoading ? (
            <CardSkeleton />
          ) : (
            <div>
              <b>{tenant?.primaryDomain}</b>
            </div>
          )}
        </Typography>
        <Typography variant="h5" className="mb-4">
          Support Email:
          {isLoading ? (
            <CardSkeleton />
          ) : (
            <div>
              <b>{tenant?.supportEmail}</b>
            </div>
          )}
        </Typography>
        <Typography variant="h5" className="mb-4">
          Department Name:
          {isLoading ? (
            <CardSkeleton />
          ) : (
            <div>
              <b>{tenant?.departmentName}</b>
            </div>
          )}
        </Typography>
        <Typography variant="h5" className="mb-4">
          Administrators:
          {isLoading ? (
            <CardSkeleton />
          ) : (
            tenant?.administrators?.map(admin => (
              <div key={admin}>
                <b>{admin}</b>
              </div>
            ))
          )}
        </Typography>
      </div>
    </Form.Root>
  )
}
