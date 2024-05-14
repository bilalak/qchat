"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import React from "react"

import Typography from "@/components/typography"
import { GetTenantById } from "@/features/tenant-management/tenant-service"
import { Button } from "@/features/ui/button"
import { Card } from "@/features/ui/card"

const Home: React.FC = () => {
  const session = useSession()
  const tenantAdminContacts = async (): Promise<string[]> => {
    if (session.status !== "authenticated" || !session.data?.user?.tenantId) {
      console.error("User is not authenticated or tenant ID is missing")
      return ["Error fetching agency leads"]
    }

    try {
      const result = await GetTenantById(session.data.user.tenantId)

      if (result.status === "OK" && result.response) {
        return result.response.administrators
      }
      if (result.status === "NOT_FOUND") {
        return ["Error fetching agency leads"]
      }
    } catch (_error) {
      return ["Error fetching agency leads"]
    }
  }
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
        <Typography variant="h3" className="text-xl font-semibold">
          We do not have you recorded as an agency lead, therefore you are not able to view this page. If you believe
          this is an error, please contact one of the below.
        </Typography>
        <Typography variant="p" className="mt-4">
          <strong>Agency Leads:</strong>
          {tenantAdminContacts}
        </Typography>
        <Button onClick={handleRedirectHome} variant="link" ariaLabel="Return Home">
          Please click here to return home.
        </Button>
      </Card>
    </div>
  )
}

export default Home
