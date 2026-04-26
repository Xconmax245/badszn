import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 })
    }

    // Delete product (Prisma cascade will handle images and variants if configured, 
    // but let's check schema to be sure or do it manually)
    
    // Manual cleanup for relations if needed, but usually we use onDelete: Cascade in Prisma
    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Product Deletion Error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 })
  }
}
