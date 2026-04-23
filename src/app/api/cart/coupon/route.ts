import { NextResponse } from 'next/server'

// Hardcoded demo codes — swap for DB lookup when DiscountCode model is added
const DEMO_CODES: Record<string, { type: 'PERCENTAGE' | 'FLAT'; value: number; minOrder?: number }> = {
  'BADSZN10':  { type: 'PERCENTAGE', value: 10 },
  'BADSZN20':  { type: 'PERCENTAGE', value: 20 },
  'WELCOME':   { type: 'FLAT', value: 2000 },
  'FIRSTDROP': { type: 'FLAT', value: 5000, minOrder: 20000 },
}

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json()
    const normalised = (code as string).toUpperCase().trim()
    const coupon     = DEMO_CODES[normalised]

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid promo code' }, { status: 404 })
    }

    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return NextResponse.json(
        { error: `Minimum order of ₦${coupon.minOrder.toLocaleString('en-NG')} required` },
        { status: 400 }
      )
    }

    let discountAmount = 0
    if (coupon.type === 'PERCENTAGE') discountAmount = Math.round(subtotal * (coupon.value / 100))
    if (coupon.type === 'FLAT')       discountAmount = Math.min(coupon.value, subtotal)

    return NextResponse.json({
      code:           normalised,
      type:           coupon.type,
      value:          coupon.value,
      discountAmount,
      isValid:        true,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to validate code' }, { status: 500 })
  }
}
