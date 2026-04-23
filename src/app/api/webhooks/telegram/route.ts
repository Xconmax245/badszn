import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendTelegramMessage } from "@/lib/telegram"
import { formatNaira } from "@/lib/utils/formatCurrency"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message = body.message
    
    if (!message || !message.text) return NextResponse.json({ ok: true })

    const chatId = String(message.chat.id)
    const text = message.text.toLowerCase()
    
    // 1. SECURITY: Only respond to the authorized Chat ID
    if (chatId !== process.env.TELEGRAM_CHAT_ID) {
      console.warn(`Unauthorized access attempt from Chat ID: ${chatId}`)
      // Optionally notify the admin of unauthorized attempt
      // await sendTelegramMessage(`🚨 Unauthorized access attempt from Chat ID: ${chatId}`)
      return NextResponse.json({ ok: true })
    }

    // 2. COMMAND ROUTER
    if (text === "/start") {
      await sendTelegramMessage("👑 <b>BAD SZN ADMIN BOT</b>\n\nAuthorized. Use /commands to see available intelligence streams.")
    } 
    
    else if (text === "/commands") {
      const cmdList = `
<b>AVAILABLE COMMANDS:</b>

/today - Today's sales & traffic
/revenue - Revenue overview
/inventory - Low stock alerts
/users - Customer registry summary
/pending - Orders awaiting fulfillment
      `
      await sendTelegramMessage(cmdList)
    }

    else if (text === "/today") {
      const now = new Date()
      const todayStart = new Date(now.setHours(0,0,0,0))
      
      const ordersToday = await prisma.order.findMany({
        where: { 
          createdAt: { gte: todayStart },
          paymentStatus: "PAID"
        }
      })

      const revenue = ordersToday.reduce((acc, o) => acc + Number(o.total), 0)
      const visitorsToday = await prisma.visitorSession.count({
        where: { firstSeenAt: { gte: todayStart } }
      })

      await sendTelegramMessage(`
📊 <b>TODAY'S INTELLIGENCE</b>

💰 <b>Revenue:</b> ${formatNaira(revenue)}
📦 <b>Orders:</b> ${ordersToday.length}
👥 <b>Visits:</b> ${visitorsToday}
      `)
    }

    else if (text === "/revenue") {
      const paidOrders = await prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: "PAID" }
      })

      const totalRevenue = Number(paidOrders._sum.total || 0)

      await sendTelegramMessage(`
💰 <b>REVENUE REGISTRY</b>

<b>Gross Lifetime:</b> ${formatNaira(totalRevenue)}
<b>Avg Order Value:</b> ${formatNaira(totalRevenue / (await prisma.order.count({ where: { paymentStatus: "PAID" } }) || 1))}
      `)
    }

    else if (text === "/inventory") {
      const lowStock = await prisma.productVariant.findMany({
        where: { stock: { lte: 5 } },
        include: { product: true },
        orderBy: { stock: "asc" },
        take: 10
      })

      if (lowStock.length === 0) {
        await sendTelegramMessage("✅ <b>INVENTORY HEALTHY</b>\nNo items below threshold.")
      } else {
        const list = lowStock.map(v => `• ${v.product.name} (${v.size}) - <b>${v.stock} LEFT</b>`).join("\n")
        await sendTelegramMessage(`⚠️ <b>LOW STOCK ALERTS</b>\n\n${list}`)
      }
    }

    else if (text === "/users") {
      const total = await prisma.customer.count()
      const vips = await prisma.order.groupBy({
        by: ['customerId'],
        _sum: { total: true },
        having: { total: { _sum: { gt: 200000 } } }
      })

      await sendTelegramMessage(`
👥 <b>USER INTELLIGENCE</b>

<b>Total Registry:</b> ${total}
<b>VIP Segment:</b> ${vips.length}
      `)
    }

    else if (text === "/pending") {
      const pendingCount = await prisma.order.count({
        where: { 
          status: { in: ["PENDING", "CONFIRMED"] },
          paymentStatus: "PAID"
        }
      })

      await sendTelegramMessage(`📦 <b>PENDING FULFILLMENT</b>\n\nThere are <b>${pendingCount}</b> orders awaiting shipment.`)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Telegram Webhook Error:", error)
    return NextResponse.json({ ok: true }) // Always return 200 to Telegram
  }
}
