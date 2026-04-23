import { NextResponse } from "next/server"

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || ""
  
  // Mask the sensitive parts: postgresql://USER:PASS@HOST:PORT/DB
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ":****@")
  
  // Extract port
  const portMatch = dbUrl.match(/:(\d+)\//)
  const port = portMatch ? portMatch[1] : "unknown"
  
  // Check for pgbouncer param
  const hasPgbouncer = dbUrl.includes("pgbouncer=true")
  
  // ⚡ Live Prisma Check
  let prismaError = null
  let prismaSuccess = false
  try {
    const { prisma } = await import("@/lib/prisma")
    await prisma.$queryRaw`SELECT 1`
    prismaSuccess = true
  } catch (err: any) {
    prismaError = err.message || "Unknown Prisma Error"
  }
  
  return NextResponse.json({
    status: "diagnostic_complete",
    detectedPort: port,
    hasPgbouncerParam: hasPgbouncer,
    prismaConnection: prismaSuccess ? "SUCCESS" : "FAILED",
    prismaErrorMessage: prismaError,
    recommendation: prismaSuccess 
      ? "Database is responding correctly on 5432. If the site shows Offline, it might be an ISR cache issue. Try hard-refreshing." 
      : "Prisma failed to connect. Review the error message above."
  })
}
