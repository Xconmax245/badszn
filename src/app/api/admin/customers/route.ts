import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminRequest } from "@/lib/auth/admin"

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const limit = 20
  const skip = (page - 1) * limit

  try {
    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { username: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    })

    const total = await prisma.customer.count({
      where: {
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { username: { contains: query, mode: "insensitive" } },
        ],
      },
    })

    return NextResponse.json({
      customers: customers.map(c => ({
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
        email: c.email,
        username: c.username,
        totalSpend: Number(c.totalSpend),
        orderCount: c._count.orders,
        createdAt: c.createdAt,
        tier: c.loyaltyTier,
      })),
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    })
  } catch (error) {
    console.error("[admin_customers] Error:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}
