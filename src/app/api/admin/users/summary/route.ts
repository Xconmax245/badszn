import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminRequest } from "@/lib/auth/admin"

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const totalUsers = await prisma.customer.count()

  const newUsersToday = await prisma.customer.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setHours(0,0,0,0)),
      },
    },
  })

  return NextResponse.json({
    totalUsers,
    newUsersToday,
  })
}
