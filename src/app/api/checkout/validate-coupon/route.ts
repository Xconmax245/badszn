import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json()

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    const coupon = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "Invalid or inactive code" }, { status: 400 })
    }

    const now = new Date()
    if (coupon.startsAt && now < coupon.startsAt) {
      return NextResponse.json({ error: "Coupon not yet active" }, { status: 400 })
    }
    if (coupon.expiresAt && now > coupon.expiresAt) {
      return NextResponse.json({ error: "Coupon expired" }, { status: 400 })
    }

    if (coupon.maxUses && coupon.timesUsed >= coupon.maxUses) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 })
    }

    if (coupon.minOrderAmount && Number(subtotal) < Number(coupon.minOrderAmount)) {
      return NextResponse.json({ 
        error: `Minimum order amount for this code is ₦${Number(coupon.minOrderAmount).toLocaleString()}` 
      }, { status: 400 })
    }

    // Calculate discount amount
    let discountAmount = 0
    if (coupon.type === "PERCENTAGE") {
      discountAmount = Math.round(Number(subtotal) * (Number(coupon.value) / 100))
    } else if (coupon.type === "FLAT") {
      discountAmount = Math.min(Number(coupon.value), Number(subtotal))
    }

    return NextResponse.json({
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: Number(coupon.value),
      discountAmount,
    })
  } catch (error) {
    console.error("Coupon Validation Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
