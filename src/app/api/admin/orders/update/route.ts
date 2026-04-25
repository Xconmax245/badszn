import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { notifyUser } from "@/lib/notifications"
import { OrderStatus } from "@prisma/client"

export async function PATCH(req: Request) {
  try {
    const { id, status, trackingNumber, carrier } = await req.json()

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        status: status as OrderStatus,
        trackingNumber: trackingNumber || undefined,
        carrier: carrier || undefined,
        deliveredAt: status === "DELIVERED" ? new Date() : undefined
      }
    })

    // Trigger notification
    await notifyUser(id)

    return NextResponse.json({ success: true, order: updatedOrder })
  } catch (error) {
    console.error("Admin Order Update Error:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
