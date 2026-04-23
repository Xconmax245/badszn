import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json()
    if (!sessionId) return NextResponse.json({ ok: false }, { status: 400 })

    const headersList = headers()
    const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip")
    const userAgent = headersList.get("user-agent")

    const existing = await prisma.visitorSession.findUnique({
      where: { sessionId },
    })

    if (existing) {
      await prisma.visitorSession.update({
        where: { sessionId },
        data: {
          visitCount: existing.visitCount + 1,
          lastSeenAt: new Date(),
          ipAddress:  ipAddress || existing.ipAddress,
          userAgent:  userAgent || existing.userAgent,
        },
      })
    } else {
      await prisma.visitorSession.create({
        data: { 
          sessionId,
          ipAddress,
          userAgent,
        },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Tracking error:", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
