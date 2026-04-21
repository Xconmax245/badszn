import * as jose from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || "fallback_secret_for_development_only")

/**
 * Generates a secure JWT for Admin sessions
 */
export async function signAdminToken(payload: { id: string; email: string; role: string }) {
  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h") // Admins need room to work
    .sign(JWT_SECRET)
    
  return token
}
