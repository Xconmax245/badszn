import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminRequest } from "@/lib/auth/admin"
import { sendTelegramMessage } from "@/lib/telegram"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminRequest(req)
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { status } = await req.json()
    if (!status) return NextResponse.json({ error: "Status required" }, { status: 400 })

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: {
        customer: true,
      }
    })

    // Telegram Notification for Status Change
    const customerName = order.customer ? `@${order.customer.username}` : (order.guestFirstName || "Guest")
    const emoji = status === "SHIPPED" ? "🚚" : status === "DELIVERED" ? "✅" : "📦"
    
    const message = `
${emoji} <b>ORDER STATUS UPDATE</b>

<b>Order ID:</b> <code>${order.orderNumber}</code>
<b>Customer:</b> ${customerName}
<b>New Status:</b> <b>${status}</b>

<i>The system has updated the fulfillment logs.</i>
    `
    
    await sendTelegramMessage(message)

    return NextResponse.json(order)
  } catch (error) {
    console.error("Order status update error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
