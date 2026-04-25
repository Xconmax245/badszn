import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 })
    }

    // 1. Double check with Paystack directly (for immediate feedback)
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    )
    
    const paystackData = await paystackRes.json()

    // 2. If Paystack says it's not successful, we don't need to check DB yet
    if (!paystackData.status || paystackData.data.status !== "success") {
      return NextResponse.json({ status: "PENDING", message: "Paystack verification pending" })
    }

    // 3. Get the orderId from metadata (which we passed during initialization)
    const orderId = paystackData.data.metadata?.orderId

    if (!orderId) {
      // Fallback: search by reference if metadata is missing
      const orderByRef = await prisma.order.findUnique({
        where: { id: reference }, // We often use order.id as reference
      })
      return NextResponse.json({ status: orderByRef?.status ?? "PENDING" })
    }

    // 4. Check our database to see if the webhook has updated the status to PAID
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true }
    })

    return NextResponse.json({
      status: order?.status ?? "PENDING",
    })
  } catch (error) {
    console.error("Verification API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
