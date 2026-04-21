import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminRequest } from "@/lib/auth/admin"

// Unified activity item shape
type ActivityItem = {
  id:        string
  type:      "order" | "customer" | "review"
  message:   string
  createdAt: string
  meta:      Record<string, unknown>
}

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Run sequentially to prevent connection pool exhaustion when limit is 1
  const orders = await prisma.order.findMany({
    take:    5,
    orderBy: { createdAt: "desc" },
    select: {
      id:          true,
      orderNumber: true,
      total:       true,
      status:      true,
      createdAt:   true,
      customer: {
        select: { firstName: true, lastName: true }
      },
      guestFirstName: true,
      guestLastName:  true,
    },
  })

  const customers = await prisma.customer.findMany({
    take:    5,
    orderBy: { createdAt: "desc" },
    select: {
      id:        true,
      firstName: true,
      lastName:  true,
      email:     true,
      createdAt: true,
    },
  })

  const reviews = await prisma.review.findMany({
    take:    5,
    orderBy: { createdAt: "desc" },
    select: {
      id:        true,
      rating:    true,
      createdAt: true,
      product: { select: { name: true } },
      customer: { select: { firstName: true } },
    },
  })

  // ── Normalize into unified format ────────────
  const activity: ActivityItem[] = [
    ...orders.map((o) => {
      const name = o.customer
        ? `${o.customer.firstName} ${o.customer.lastName}`
        : `${o.guestFirstName ?? "Guest"} ${o.guestLastName ?? ""}`
      return {
        id:        o.id,
        type:      "order" as const,
        message:   `Order #${o.orderNumber} placed by ${name.trim()}`,
        createdAt: o.createdAt.toISOString(),
        meta: {
          orderNumber: o.orderNumber,
          total:       Number(o.total),
          status:      o.status,
        },
      }
    }),

    ...customers.map((c) => ({
      id:        c.id,
      type:      "customer" as const,
      message:   `${c.firstName} ${c.lastName} joined`,
      createdAt: c.createdAt.toISOString(),
      meta: { email: c.email },
    })),

    ...reviews.map((r) => ({
      id:        r.id,
      type:      "review" as const,
      message:   `${r.customer.firstName} left a ${r.rating}★ review on ${r.product.name}`,
      createdAt: r.createdAt.toISOString(),
      meta: {
        rating:      r.rating,
        productName: r.product.name,
      },
    })),
  ]

  // ── Sort all by most recent ──────────────────
  activity.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return NextResponse.json({ activity: activity.slice(0, 15) })
}
