import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { code, type, value, expiresAt, minOrderAmount, maxUses } = await request.json();

    if (!code || !type || !value) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newDiscount = await prisma.discountCode.create({
      data: {
        code: code.toUpperCase(),
        type,
        value: parseFloat(value),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
        maxUses: maxUses ? parseInt(maxUses) : null,
      },
    });

    return NextResponse.json(newDiscount);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Discount code already exists" }, { status: 409 });
    }
    console.error("❌ Discount Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
