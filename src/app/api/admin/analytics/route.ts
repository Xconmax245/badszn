import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminRequest } from "@/lib/auth/admin"

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const totalVisits = await prisma.visitorSession.count()

  const todayVisits = await prisma.visitorSession.count({
    where: {
      firstSeenAt: {
        gte: new Date(new Date().setHours(0,0,0,0)),
      },
    },
  })

  const returningVisitors = await prisma.visitorSession.count({
    where: {
      visitCount: { gt: 1 },
    },
  })

  return NextResponse.json({
    totalVisits,
    todayVisits,
    returningVisitors,
  })
}
