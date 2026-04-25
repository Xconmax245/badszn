import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendTelegramMessage } from "@/lib/telegram"
import { formatOrderMessage } from "@/lib/formatOrder"
import crypto from "crypto"
import { OrderStatus, PaymentStatus } from "@prisma/client" // Re-syncing types

export async function POST(req: Request) {
  try {
    const bodyText = await req.text()
    const body = JSON.parse(bodyText)
    const signature = req.headers.get("x-paystack-signature")

    // 1. Verify signature (Security)
    const secret = process.env.PAYSTACK_SECRET_KEY!
    if (!secret) {
      console.error("PAYSTACK_SECRET_KEY missing")
      return NextResponse.json({ error: "Configuration error" }, { status: 500 })
    }

    const hash = crypto
      .createHmac("sha512", secret)
      .update(bodyText)
      .digest("hex")

    if (hash !== signature) {
      console.warn("Invalid Paystack signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // 2. Handle Event
    const event = JSON.parse(bodyText)
    console.log("🔔 Paystack Webhook Received:", { 
      event: event.event, 
      reference: event.data?.reference,
      status: event.data?.status 
    })

    if (event.event === "charge.success") {
      const orderId = event.data.metadata?.orderId
      console.log("📦 Processing Order ID:", orderId)
      
      if (!orderId) {
        console.error("❌ Webhook Error: No orderId in metadata")
        return NextResponse.json({ error: "No orderId" }, { status: 400 })
      }

      // Use a transaction to ensure atomic update and handle potential race conditions
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { 
          status: OrderStatus.PAID,
          paymentStatus: PaymentStatus.PAID,
          paidAt: new Date(),
          paystackData: event.data,
        },
        include: {
          customer: true,
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      })

      if (order) {
        // 3. Increment Discount Code usage if applicable
        if (order.discountCodeId) {
          await prisma.discountCode.update({
            where: { id: order.discountCodeId },
            data: { timesUsed: { increment: 1 } }
          }).catch(err => console.error("Failed to increment discount usage:", err))
        }

        // 4. Send Telegram Notification
        // We use the webhook as the single source of truth for notifications
        try {
          const message = formatOrderMessage(order)
          await sendTelegramMessage(message)
          console.log(`Order ${order.orderNumber} successfully paid and notified via Telegram.`)
        } catch (notifyError) {
          console.error("Telegram notification failed but order was marked as paid:", notifyError)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Paystack Webhook Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
