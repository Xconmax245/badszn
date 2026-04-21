import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/notifications/telegram";
import { formatNaira } from "@/lib/utils/formatCurrency";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, fulfillmentStatus } = await request.json();
    const orderId = params.id;

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        items: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status || existingOrder.status,
        fulfillmentStatus: fulfillmentStatus || existingOrder.fulfillmentStatus,
      },
    });

    // ─── TELEGRAM NOTIFICATION ────────────────────────────────
    // Trigger on: Order Marked as Shipped
    if (status === "SHIPPED" && existingOrder.status !== "SHIPPED") {
      const message = `
📦 <b>ORDER SHIPPED</b>

<b>Order:</b> #${existingOrder.orderNumber}
<b>Customer:</b> ${existingOrder.guestFirstName || existingOrder.customer?.firstName || "Guest"}
<b>Status:</b> Shipped
<b>Total:</b> ${formatNaira(Number(existingOrder.total))}

<i>Track this package in the admin dashboard.</i>`;
      
      await sendTelegramMessage(message);
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("❌ Order Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
