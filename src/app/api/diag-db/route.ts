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
  
  return NextResponse.json({
    status: "diagnostic_complete",
    detectedPort: port,
    hasPgbouncerParam: hasPgbouncer,
    maskedConnection: maskedUrl,
    recommendation: port === "6543" 
      ? "CRITICAL: You are still on the Pooled Port (6543). Change it to 5432 in Vercel settings." 
      : "Port 5432 detected. If still crashing, remove ?pgbouncer=true from the URL."
  })
}
