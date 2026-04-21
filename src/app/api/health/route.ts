import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({
      status:    "Synchronized",
      db:        "Connected",
      timestamp: new Date().toISOString(),
      version:   process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0",
    })
  } catch (error) {
    return NextResponse.json({
      status:    "Degraded",
      db:        "Disconnected",
      timestamp: new Date().toISOString(),
    }, { status: 503 })
  }
}
