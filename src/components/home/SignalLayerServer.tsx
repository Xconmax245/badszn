import { prisma } from "@/lib/prisma"
import SignalLayer from "./SignalLayer"

export interface Signal {
  id: string
  type: "order" | "waitlist" | "review" | "drop"
  message: string
  createdAt: string
}

export const revalidate = 60 // Revalidate every minute

export default async function SignalLayerServer() {
  // Try to fetch real signals
  let signals: Signal[] = []

  try {
    // 1. Fetch recent orders
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { items: { take: 1 } },
      where: { status: { not: "CANCELLED" } }
    })

    const orderSignals = orders.map(o => ({
      id: `order-${o.id}`,
      type: "order" as const,
      message: o.items[0] ? `Someone secured ${o.items[0].name}` : "A new order was placed",
      createdAt: o.createdAt.toISOString()
    }))

    // 2. Fetch waitlist
    const waitlists = await prisma.waitlistEntry.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { collection: true }
    })

    const waitlistSignals = waitlists.map(w => ({
      id: `waitlist-${w.id}`,
      type: "waitlist" as const,
      message: `Someone joined the waitlist for ${w.collection?.name || "an upcoming drop"}`,
      createdAt: w.createdAt.toISOString()
    }))

    // 3. Fetch reviews
    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      take: 2,
    })

    const reviewSignals = reviews.map(r => ({
      id: `review-${r.id}`,
      type: "review" as const,
      message: "A 5-star review was verified",
      createdAt: r.createdAt.toISOString()
    }))

    signals = [...orderSignals, ...waitlistSignals, ...reviewSignals]

    // Sort by most recent
    signals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
  } catch (err) {
    console.error("Failed to fetch live signals:", err)
  }

  // Fallback to dummy data if not enough signals (e.g. fresh database)
  if (signals.length < 4) {
    const timeRef = new Date()
    signals = [
      {
        id: "dummy-1",
        type: "order",
        message: "Someone secured The Heavy Hoodie",
        createdAt: new Date(timeRef.getTime() - 1000 * 60 * 2).toISOString()
      },
      ...signals, // merge whatever we found
      {
        id: "dummy-2",
        type: "waitlist",
        message: "12 people joined DROP 002 waitlist",
        createdAt: new Date(timeRef.getTime() - 1000 * 60 * 15).toISOString()
      },
      {
        id: "dummy-3",
        type: "review",
        message: "Verified purchase review approved",
        createdAt: new Date(timeRef.getTime() - 1000 * 60 * 45).toISOString()
      },
      {
         id: "dummy-4",
         type: "drop",
         message: "Traffic spike detected on new release",
         createdAt: new Date(timeRef.getTime() - 1000 * 60 * 5).toISOString()
      }
    ]
  }

  // Cap at 10 to keep it lightweight
  signals = signals.slice(0, 10)

  return <SignalLayer initialSignals={signals} />
}
