import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminRequest } from "@/lib/auth/admin"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdminRequest(req)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            items: true
          }
        },
        cartSession: {
          include: {
            items: {
              include: {
                product: {
                  select: { name: true, slug: true }
                }
              }
            }
          }
        },
        eventLogs: {
          orderBy: { timestamp: "desc" },
          take: 20
        },
        addresses: true
      },
    })

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error("[admin_customer_detail] Error:", error)
    return NextResponse.json({ error: "Failed to fetch customer details" }, { status: 500 })
  }
}
