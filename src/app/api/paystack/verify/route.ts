import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { OrderStatus, PaymentStatus } from "@prisma/client" // Re-syncing types

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 })
    }

    // 1. Double check with Paystack directly (for immediate feedback)
    const PAYSTACK_SECRET = (process.env.PAYSTACK_SECRET_KEY || "").trim().replace(/^["']|["']$/g, "")
    
    if (!PAYSTACK_SECRET) {
      console.error("❌ Verify API Error: PAYSTACK_SECRET_KEY missing")
      return NextResponse.json({ error: "Configuration error" }, { status: 500 })
    }

    console.log("🔍 Verifying Payment:", { 
      reference,
      key_prefix: PAYSTACK_SECRET.substring(0, 7),
      key_suffix: PAYSTACK_SECRET.slice(-4)
    })

    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    )
    
    const paystackData = await paystackRes.json()

    // 2. If Paystack says it's not successful, we don't need to check DB yet
    if (!paystackData.status || paystackData.data.status !== "success") {
      return NextResponse.json({ status: "PENDING", message: "Paystack verification pending" })
    }

    // 3. Get the orderId from metadata (which we passed during initialization)
    const orderId = paystackData.data.metadata?.orderId

    if (!orderId) {
      // Fallback: search by reference if metadata is missing
      const orderByRef = await prisma.order.findUnique({
        where: { id: reference }, // We often use order.id as reference
      })
      return NextResponse.json({ status: orderByRef?.status ?? "PENDING" })
    }

    // 4. Check our database
    let order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, status: true, orderNumber: true }
    })

    // ⚡ FALLBACK: If Paystack says success BUT DB is not PAID yet
    // This handles webhook delays or failures gracefully
    if (order && order.status !== OrderStatus.PAID) {
      console.log(`Fallback Sync: Updating order ${order.id} to PAID via Verify API`)
      
      order = await prisma.order.update({
        where: { id: orderId },
        data: { 
          status: OrderStatus.PAID,
          paymentStatus: PaymentStatus.PAID,
          paidAt: new Date()
        }
      })

      // Increment coupon if needed
      if ((order as any).discountCodeId) {
        await prisma.discountCode.update({
          where: { id: (order as any).discountCodeId },
          data: { timesUsed: { increment: 1 } }
        }).catch(() => {})
      }
    }

    return NextResponse.json({
      status: order?.status ?? "PENDING",
    })
  } catch (error) {
    console.error("Verification API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
