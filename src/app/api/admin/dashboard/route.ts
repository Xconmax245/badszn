import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminRequest } from "@/lib/auth/admin"

// Safe query wrapper — never throws, returns fallback on failure
async function safeQuery<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    console.error("[dashboard] query failed:", err)
    return fallback
  }
}

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now      = new Date()
  const last24h  = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const prev24h  = new Date(now.getTime() - 48 * 60 * 60 * 1000)

  // 1. Revenue (Sequential)
  const totalRevenue = await safeQuery(() => prisma.order.aggregate({
    _sum: { total: true },
    where: { paymentStatus: "PAID" },
  }), { _sum: { total: null } })

  const revenueToday = await safeQuery(() => prisma.order.aggregate({
    _sum: { total: true },
    where: { paymentStatus: "PAID", createdAt: { gte: last24h } },
  }), { _sum: { total: null } })

  const revenueYesterday = await safeQuery(() => prisma.order.aggregate({
    _sum: { total: true },
    where: { paymentStatus: "PAID", createdAt: { gte: prev24h, lt: last24h } },
  }), { _sum: { total: null } })

  // 2. Orders - Collapsed into 1 Raw SQL query (Sequential)
  const orderCountsResult = await safeQuery(() => prisma.$queryRaw<any[]>`
    SELECT 
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE created_at >= ${last24h})::int AS today,
      COUNT(*) FILTER (WHERE created_at >= ${prev24h} AND created_at < ${last24h})::int AS yesterday,
      COUNT(*) FILTER (WHERE fulfillment_status = 'UNFULFILLED' AND payment_status = 'PAID')::int AS pending
    FROM orders
  `, [{ total: 0, today: 0, yesterday: 0, pending: 0 }])
  const orderCounts = orderCountsResult[0]

  // 3. Customers - Collapsed into 1 Raw SQL query (Sequential)
  const customerCountsResult = await safeQuery(() => prisma.$queryRaw<any[]>`
    SELECT 
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE created_at >= ${last24h})::int AS "newToday",
      COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = customers.id))::int AS repeat
    FROM customers
  `, [{ total: 0, newToday: 0, repeat: 0 }])
  const customerCounts = customerCountsResult[0]
  
  // 3.5. Visitors (Sequential)
  const visitorCountsResult = await safeQuery(() => prisma.$queryRaw<any[]>`
    SELECT 
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE first_seen_at >= ${last24h})::int AS today,
      COUNT(*) FILTER (WHERE visit_count > 1)::int AS returning
    FROM visitor_sessions
  `, [{ total: 0, today: 0, returning: 0 }])
  const visitorCounts = visitorCountsResult[0]

  // 4. Inventory (Sequential)
  const criticalStock = await safeQuery(() => prisma.productVariant.count({
    where: { stock: { lt: 3 } },
  }), 0)

  const lowStock = await safeQuery(() => prisma.productVariant.count({
    where: { stock: { lt: 10, gte: 3 } },
  }), 0)

  const calcGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  const todayRev     = Number(revenueToday._sum.total     ?? 0)
  const yesterdayRev = Number(revenueYesterday._sum.total ?? 0)

  // 5. Low Stock Tracking (Sequential)
  const lowStockVariants = await safeQuery(async () => {
    const variants = await prisma.productVariant.findMany({
      where: { stock: { lte: 5 } },
      orderBy: { stock: "asc" },
      take: 10,
      include: {
        product: {
          select: {
            name:   true,
            slug:   true,
            images: {
              where:   { isPrimary: true },
              take:    1,
              select:  { url: true },
            },
          },
        },
      },
    })
    return variants.map((v) => ({
      variantId:   v.id,
      sku:         v.sku,
      size:        v.size,
      color:       v.color,
      stock:       v.stock,
      status:      v.stock === 0 ? "Out of Stock" : v.stock < 3 ? "Critical" : "Low",
      productName: v.product.name,
      productSlug: v.product.slug,
      imageUrl:    v.product.images[0]?.url ?? null,
    }))
  }, [])

  // 6. Drop Status (Sequential)
  const dropStatus = await safeQuery(async () => {
    const collection = await prisma.collection.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: {
        products: { select: { id: true } },
        waitlist: { select: { id: true } },
      },
    })
    if (!collection) return null
    return {
      id:            collection.id,
      name:          collection.name,
      slug:          collection.slug,
      launchDate:    collection.launchDate?.toISOString() ?? null,
      waitlistCount: collection.waitlist.length,
      productCount:  collection.products.length,
      buildId:       process.env.NEXT_PUBLIC_BUILD_ID ?? "DEV",
    }
  }, null)

  // 7. Recent Activity (Sequential)
  const recentOrders = await safeQuery(() => prisma.order.findMany({
    take: 3, orderBy: { createdAt: "desc" },
    select: { id: true, orderNumber: true, total: true, status: true, createdAt: true, customer: { select: { firstName: true, lastName: true } }, guestFirstName: true, guestLastName:  true }
  }), [])

  const recentCustomers = await safeQuery(() => prisma.customer.findMany({
    take: 3, orderBy: { createdAt: "desc" },
    select: { id: true, firstName: true, lastName: true, email: true, createdAt: true }
  }), [])

  const recentReviews = await safeQuery(() => prisma.review.findMany({
    take: 3, orderBy: { createdAt: "desc" },
    select: { id: true, rating: true, createdAt: true, product: { select: { name: true } }, customer: { select: { firstName: true } } }
  }), [])

  const activity = [
    ...recentOrders.map((o) => ({
      id: o.id, type: "order", 
      message: `Order #${o.orderNumber} placed by ${(o.customer ? o.customer.firstName + ' ' + o.customer.lastName : (o.guestFirstName || 'Guest') + ' ' + (o.guestLastName || '')).trim()}`,
      createdAt: o.createdAt.toISOString(),
      meta: { orderNumber: o.orderNumber, total: Number(o.total), status: o.status }
    })),
    ...recentCustomers.map((c) => ({
      id: c.id, type: "customer", message: `${c.firstName} ${c.lastName} joined`,
      createdAt: c.createdAt.toISOString(), meta: { email: c.email }
    })),
    ...recentReviews.map((r) => ({
      id: r.id, type: "review", message: `${r.customer.firstName} left a ${r.rating}★ review on ${r.product.name}`,
      createdAt: r.createdAt.toISOString(), meta: { rating: r.rating, productName: r.product.name }
    }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8)

  return NextResponse.json({
    revenue: {
      total:    Number(totalRevenue._sum.total ?? 0),
      today:    todayRev,
      growth:   calcGrowth(todayRev, yesterdayRev),
    },
    orders: {
      total:    orderCounts.total,
      today:    orderCounts.today,
      pending:  orderCounts.pending,
      growth:   calcGrowth(orderCounts.today, orderCounts.yesterday),
    },
    customers: {
      total:      customerCounts.total,
      newToday:   customerCounts.newToday,
      retention:  customerCounts.total > 0
        ? Math.round((customerCounts.repeat / customerCounts.total) * 100)
        : 0,
    },
    visitors: {
      total:     visitorCounts.total,
      today:     visitorCounts.today,
      returning: visitorCounts.returning,
      conversionRate: visitorCounts.total > 0 
        ? ((orderCounts.total / visitorCounts.total) * 100).toFixed(2) 
        : "0.00",
    },
    inventory: {
      status:   criticalStock > 0 ? "Critical" : lowStock > 0 ? "Low" : "Healthy",
      critical: criticalStock,
      low:      lowStock,
    },
    lowStock: lowStockVariants,
    dropStatus: dropStatus,
    activity: activity,
    fetchedAt: now.toISOString(),
    version: process.env.NEXT_PUBLIC_BUILD_ID ?? "1.0",
  })
}


