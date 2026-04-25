import { prisma } from "./prisma"
import { sendTelegramMessage } from "./telegram"

export async function notifyUser(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: {
          include: {
            user: true
          }
        },
        items: true
      }
    })

    if (!order) return

    const email = order.guestEmail || (order as any).customer?.user?.email
    const status = order.status

    console.log(`🔔 Notification Triggered for Order ${order.id} [${status}] to ${email}`)

    // 1. Telegram Notification for Admin
    let adminMessage = ""
    if (status === "PAID") {
      adminMessage = `💰 *New Payment Received*\nOrder: #${order.orderNumber}\nAmount: ₦${Number(order.total).toLocaleString()}\nCustomer: ${email}`
    } else if (status === "SHIPPED") {
      adminMessage = `🚚 *Order Shipped*\nOrder: #${order.orderNumber}\nCustomer: ${email}`
    } else if (status === "DELIVERED") {
      adminMessage = `✅ *Order Delivered*\nOrder: #${order.orderNumber}\nCustomer: ${email}`
    }

    if (adminMessage) {
      await sendTelegramMessage(adminMessage)
    }

    // 2. Email Notification (Placeholder for Resend/SendGrid)
    // Here you would integrate your email provider
    // Example: await sendEmail({ to: email, subject: "Order Update", ... })

  } catch (error) {
    console.error("Notification System Error:", error)
  }
}
