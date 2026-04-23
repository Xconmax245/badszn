import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  // Try to get logged-in customer
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Guest — cart is in localStorage, nothing to fetch from DB
    return NextResponse.json({ items: [] })
  }

  const customer = await prisma.customer.findUnique({
    where: { supabaseUid: user.id },
  })

  if (!customer) return NextResponse.json({ items: [] })

  const cartSession = await prisma.cartSession.findUnique({
    where: { customerId: customer.id },
    include: {
      items: {
        include: {
          product: {
            select: {
              name:   true,
              slug:   true,
              images: {
                where:  { isPrimary: true },
                take:   1,
                select: { url: true },
              },
            },
          },
          variant: {
            select: {
              size:  true,
              color: true,
              price: true,
            },
          },
        },
      },
    },
  })

  if (!cartSession) return NextResponse.json({ items: [] })

  const items = cartSession.items.map((item) => ({
    id:        item.id,
    productId: item.productId,
    variantId: item.variantId,
    name:      item.product.name,
    slug:      item.product.slug,
    size:      item.variant.size,
    color:     item.variant.color,
    imageUrl:  item.product.images[0]?.url ?? null,
    price:     Number(item.variant.price ?? 0),
    quantity:  item.quantity,
  }))

  return NextResponse.json({ items })
}

export async function POST(req: Request) {
  const { productId, variantId, quantity = 1 } = await req.json()

  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Guest — handled client-side by Zustand + localStorage
    return NextResponse.json({ success: true, guest: true })
  }

  const customer = await prisma.customer.findUnique({
    where: { supabaseUid: user.id },
  })

  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 })
  }

  // Get or create cart session
  let cartSession = await prisma.cartSession.findUnique({
    where: { customerId: customer.id },
  })

  if (!cartSession) {
    cartSession = await prisma.cartSession.create({
      data: {
        customerId: customer.id,
        expiresAt:  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })
  }

  // Upsert cart item
  const existing = await prisma.cartItem.findFirst({
    where: {
      sessionId: cartSession.id,
      variantId,
    },
  })

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data:  { quantity: existing.quantity + quantity },
    })
  } else {
    await prisma.cartItem.create({
      data: {
        sessionId: cartSession.id,
        productId,
        variantId,
        quantity,
      },
    })
  }

  return NextResponse.json({ success: true })
}
