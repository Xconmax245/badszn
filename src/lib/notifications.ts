import { prisma } from "./prisma"
import { sendTelegramMessage } from "./telegram"
import { resend } from "./resend"
import { orderConfirmationTemplate } from "./emails/orderConfirmation"
import { paymentReceivedTemplate } from "./emails/paymentReceived"

export async function notifyUser(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        items: true
      }
    })

    if (!order) return

    const email = order.guestEmail || order.customer?.email
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

    // 2. Email Notification
    if (email) {
      const fromEmail = process.env.EMAIL_FROM || "BAD SZN <no-reply@badszn.shop>"
      
      if (status === "PAID") {
        // Send Order Confirmation
        const confirmation = orderConfirmationTemplate({
          name: order.guestFirstName || order.customer?.firstName || undefined,
          orderNumber: order.orderNumber || order.id.slice(0, 8),
          items: order.items.map(i => ({
            name: i.name,
            quantity: i.quantity,
            price: Number(i.price)
          })),
          total: Number(order.total)
        })

        await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: confirmation.subject,
          html: confirmation.html,
        }).catch(err => console.error("Resend Order Confirm Error:", err))

        // Send Payment Received (Separate as requested)
        const payment = paymentReceivedTemplate({
          orderNumber: order.orderNumber || order.id.slice(0, 8)
        })

        await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: payment.subject,
          html: payment.html,
        }).catch(err => console.error("Resend Payment Received Error:", err))
      }
    }

  } catch (error) {
    console.error("Notification System Error:", error)
  }
}
