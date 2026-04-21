import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/notifications/telegram";

export async function PATCH(request: Request) {
  try {
    const { ids, type, action, value } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0 || ids.length > 50) {
      return NextResponse.json({ error: "Invalid record batch (Max 50)" }, { status: 400 });
    }

    if (type === "ORDER" && action === "SET_STATUS") {
      await prisma.order.updateMany({
        where: { id: { in: ids } },
        data: { status: value },
      });

      // Optional: Send a summary telegram message for the bulk action
      if (value === "SHIPPED") {
        await sendTelegramMessage(`📦 BULK ACTION: ${ids.length} orders marked as SHIPPED.`);
      }

      return NextResponse.json({ success: true, count: ids.length });
    }

    if (type === "REVIEW" && action === "SET_APPROVED") {
      await prisma.review.updateMany({
        where: { id: { in: ids } },
        data: { isApproved: value },
      });

      return NextResponse.json({ success: true, count: ids.length });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (error) {
    console.error("❌ Bulk Action Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
