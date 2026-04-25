import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { items, subtotal, total, shippingCost, shippingAddress, discountCodeId, discountAmount } = await req.json()
    const orderNumber = `BS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    console.log("Creating order:", { orderNumber, total, subtotal, shippingCost })

    const customer = await prisma.customer.findUnique({
      where: { supabaseUid: user.id }
    })

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer?.id,
        guestEmail: user.email,
        subtotal,
        discountAmount: discountAmount || 0,
        discountCodeId: discountCodeId || null,
        shippingCost: shippingCost || 0,
        total,
        status: "PENDING",
        paymentStatus: "UNPAID",
        shippingAddress: shippingAddress || undefined,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            size: item.size,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
            imageUrl: item.imageUrl || item.image || null
          }))
        }
      }
    })

    console.log("Order created in DB:", order.id)

    // ⚡ 2. Initialize Paystack
    const { initializePayment } = await import("@/lib/paystack")
    try {
      const paymentUrl = await initializePayment({
        email: user.email!,
        amount: Math.round(Number(total) * 100), // convert to kobo
        reference: order.id,
        metadata: { orderId: order.id },
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?reference=${order.id}`,
      })

      return NextResponse.json({ url: paymentUrl, orderId: order.id })
    } catch (paystackError: any) {
      console.error("Paystack Init Failed:", paystackError)
      return NextResponse.json({ error: paystackError.message || "Payment initialization failed" }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Critical Order Creation Error:", error)
    return NextResponse.json({ 
      error: "Failed to create order",
      details: error.message 
    }, { status: 500 })
  }
}
