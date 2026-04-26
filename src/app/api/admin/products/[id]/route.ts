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
    
    // 1. Cleanup non-critical relations that might block deletion
    await prisma.cartItem.deleteMany({ where: { productId: id } })
    await prisma.wishlist.deleteMany({ where: { productId: id } })
    await prisma.lookbookProduct.deleteMany({ where: { productId: id } })
    await prisma.collectionProduct.deleteMany({ where: { productId: id } })

    try {
      // 2. Attempt Hard Delete (will fail if linked to Orders/Reviews)
      await prisma.product.delete({
        where: { id }
      })
      return NextResponse.json({ success: true, mode: "deleted" })
    } catch (dbError: any) {
      // 3. Fallback to ARCHIVED if there are orders/reviews
      console.log("Hard delete blocked, switching to Archive:", dbError.message)
      await prisma.product.update({
        where: { id },
        data: { status: "ARCHIVED" }
      })
      return NextResponse.json({ 
        success: true, 
        mode: "archived",
        message: "Product archived because it is linked to order history." 
      })
    }
  } catch (error: any) {
    console.error("Product Deletion Error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 })
  }
}
