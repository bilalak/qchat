import { Client } from "@microsoft/microsoft-graph-client"
import { NextRequest, NextResponse } from "next/server"
import { getToken, JWT } from "next-auth/jwt"
import * as yup from "yup"

import { userSession } from "@/features/auth/helpers"
import { GetTenantById, UpdateTenant } from "@/features/tenant-management/tenant-service"

const groupValidationSchema = yup
  .object({
    groupGuids: yup.array().of(yup.string().required()).required(),
  })
  .noUnknown(true, "Attempted to validate invalid fields")

const groupDeleteValidationSchema = yup
  .object({
    tenantId: yup.string().required(),
    groupGuids: yup.array().of(yup.string().required()).required(),
  })
  .noUnknown(true, "Attempted to validate invalid fields")

const getAccessTokenFromJWT = async (req: NextRequest): Promise<string | null> => {
  const token = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET })) as JWT
  return token?.accessToken as string | null
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const requestBody = await req.json()
    const accessToken = await getAccessTokenFromJWT(req)

    const validatedData = await groupValidationSchema.validate(requestBody, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (!accessToken) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const client = Client.init({
      authProvider: done => {
        done(null, accessToken)
      },
    })

    const { groupGuids } = validatedData

    try {
      const groupDetails = await Promise.all(
        groupGuids.map(async guid => {
          try {
            const group = await client.api(`/groups/${guid}`).get()
            return {
              guid,
              name: group.displayName,
              isValid: group.securityEnabled,
            }
          } catch (_error) {
            return {
              guid,
              name: null,
              isValid: false,
            }
          }
        })
      )

      const response = groupDetails.map(group => ({
        guid: group.guid,
        name: group.name,
        isValid: group.isValid,
      }))

      return new NextResponse(JSON.stringify(response), { status: 200 })
    } catch (error: unknown) {
      return new NextResponse(JSON.stringify({ error: "Error validating groups", details: (error as Error).message }), {
        status: 500,
      })
    }
  } catch (error) {
    const errorMessage = error instanceof yup.ValidationError ? { errors: error.errors } : "Internal Server Error"
    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: error instanceof yup.ValidationError ? 400 : 500,
    })
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const [requestBody, user] = await Promise.all([request.json(), userSession()])
  const validatedData = await groupDeleteValidationSchema.validate(
    { ...requestBody, tenantId: user?.tenantId },
    {
      abortEarly: false,
      stripUnknown: true,
    }
  )
  const { groupGuids: groupsToDelete, tenantId } = validatedData

  const existingTenantResult = await GetTenantById(tenantId)
  if (existingTenantResult.status !== "OK") {
    return new NextResponse(JSON.stringify({ error: "Tenant not found" }), { status: 404 })
  }
  if (!user || !existingTenantResult.response.administrators.includes(user.email)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const updatedGroups = existingTenantResult.response.groups.filter(
    group => !groupsToDelete.some(toDelete => toDelete.toLowerCase() === group.toLowerCase())
  )

  const updatedTenantResult = await UpdateTenant({ ...existingTenantResult.response, groups: updatedGroups })
  if (updatedTenantResult.status === "OK") {
    return new NextResponse(JSON.stringify(updatedTenantResult.response), { status: 200 })
  }
  return new NextResponse(JSON.stringify({ error: "Failed to update tenant" }), { status: 400 })
}

export const GET = (): NextResponse =>
  new NextResponse(JSON.stringify({ error: "GET method not supported for this route" }), { status: 405 })
