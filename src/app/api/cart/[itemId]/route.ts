import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  const { quantity } = await req.json()

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: params.itemId } })
    return NextResponse.json({ success: true, deleted: true })
  }

  await prisma.cartItem.update({
    where: { id: params.itemId },
    data:  { quantity },
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _req: Request,
  { params }: { params: { itemId: string } }
) {
  await prisma.cartItem.delete({ where: { id: params.itemId } })
  return NextResponse.json({ success: true })
}
