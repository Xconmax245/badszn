import { cookies } from "next/headers"
import * as jose from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET)

// Verifies the custom Admin JWT format locally
export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    throw new Error("Invalid admin token")
  }
}

// Helper to verify admin in API routes
export async function verifyAdminRequest(req: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get("admin_token")?.value

  if (!token) return null

  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET)
    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as "SUPER_ADMIN" | "ADMIN",
    }
  } catch {
    return null
  }
}

// Helper for Server Components
export async function getAdminSession() {
  const cookieStore = cookies()
  const token = cookieStore.get("admin_token")?.value

  if (!token) return null

  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET)
    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as "SUPER_ADMIN" | "ADMIN",
    }
  } catch {
    return null
  }
}

// Role display mapping
export function getRoleDisplay(role: "SUPER_ADMIN" | "ADMIN") {
  return role === "SUPER_ADMIN" ? "Level 00" : "Level 01"
}
