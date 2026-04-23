import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminRequest } from "@/lib/auth/admin"

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const users = await prisma.customer.findMany({
    include: {
      orders: true,
    },
    orderBy: { createdAt: "desc" }
  })

  const data = users.map(user => {
    const totalOrders = user.orders.length
    const totalSpent = user.orders.reduce((acc, o) => acc + Number(o.total), 0)
    
    // Segmentation logic
    let status = "REGISTERED ONLY"
    if (totalSpent > 200000) status = "VIP"
    else if (totalOrders >= 5) status = "LOYAL"
    else if (totalOrders >= 1) status = "NEW"

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      totalOrders,
      totalSpent,
      avgOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
      lastOrderDate: user.orders[0]?.createdAt ?? null,
      accountAge: Date.now() - new Date(user.createdAt).getTime(),
      status,
      createdAt: user.createdAt
    }
  })

  return NextResponse.json(data)
}
