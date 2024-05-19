"use client"

import { useRouter } from "next/navigation"
import React from "react"

import Typography from "@/components/typography"
import { TenantContactForm } from "@/features/tenant-management/tenant-contacts"
import { Button } from "@/features/ui/button"
import { Card } from "@/features/ui/card"

const Home: React.FC = () => {
  const router = useRouter()

  const handleRedirectHome = async (): Promise<void> => {
    try {
      await router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Redirect failed:", error)
    }
  }

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="flex min-w-[300px] flex-col rounded-md bg-altBackground p-8 text-foreground">
        <TenantContactForm />

        <Typography variant="h3" className="text-xl font-semibold">
          We do not have you recorded as an agency lead or Global Admin, therefore you are not able to view this page.
          <br />
          If you believe this is an error, please contact one of the below.
        </Typography>
        <Typography variant="p" className="mt-4">
          <strong>Agency Leads:</strong>
        </Typography>
        <Button onClick={handleRedirectHome} variant="link" ariaLabel="Return Home">
          Please click here to return home.
        </Button>
      </Card>
    </div>
  )
}

export default Home
