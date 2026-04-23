import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendTelegramMessage } from "@/lib/telegram"
import { formatOrderMessage } from "@/lib/formatOrder"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const signature = req.headers.get("x-paystack-signature")

    // 1. Verify signature (Security)
    const secret = process.env.PAYSTACK_SECRET_KEY!
    if (!secret) {
      console.error("PAYSTACK_SECRET_KEY missing")
      return NextResponse.json({ error: "Configuration error" }, { status: 500 })
    }

    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(body))
      .digest("hex")

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // 2. Handle Event
    const event = body

    if (event.event === "charge.success") {
      const reference = event.data.reference

      // Find the order by ID or orderNumber (depending on what was sent to Paystack)
      // Usually, we send the order ID as reference
      const order = await prisma.order.update({
        where: { id: reference },
        data: { 
          paymentStatus: "PAID",
          status: "CONFIRMED",
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
        // 3. Send Telegram Notification
        const message = formatOrderMessage(order)
        await sendTelegramMessage(message)
        
        console.log(`Order ${order.orderNumber} successfully paid and notified via Telegram.`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Paystack Webhook Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
