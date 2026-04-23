import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { items, subtotal, total, shippingAddress } = await req.json()
    const orderNumber = `BS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    const customer = await prisma.customer.findUnique({
      where: { supabaseUid: user.id }
    })

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer?.id,
        guestEmail: user.email,
        subtotal,
        total,
        status: "PENDING",
        paymentStatus: "UNPAID",
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            size: item.size,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
            imageUrl: item.imageUrl
          }))
        }
      }
    })

    // ⚡ 2. Initialize Paystack
    const { initializePayment } = await import("@/lib/paystack")
    const paymentUrl = await initializePayment({
      email: user.email!,
      amount: Math.round(total * 100), // convert to kobo
      reference: order.id,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?ref=${order.id}`,
    })

    return NextResponse.json({ url: paymentUrl, orderId: order.id })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
