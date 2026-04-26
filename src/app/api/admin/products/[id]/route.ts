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
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await req.json()
    const { 
      name, slug, description, basePrice, compareAtPrice, 
      categoryId, collectionId, status, isNew, isFeatured, 
      isBestSeller, material, fit, careInstructions, 
      metaTitle, metaDescription, shippingCost,
      images, variants 
    } = body

    // 1. Update Core Product Data
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // Update basic fields
      const product = await tx.product.update({
        where: { id },
        data: {
          name,
          slug,
          description,
          basePrice: Number(basePrice),
          compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
          categoryId,
          collectionId: collectionId || null,
          status,
          isNew,
          isFeatured,
          isBestSeller,
          material,
          fit,
          careInstructions,
          metaTitle,
          metaDescription,
          shippingCost: Number(shippingCost)
        }
      })

      // 2. Sync Images (Delete existing and recreate for simplicity or use more complex sync)
      await tx.productImage.deleteMany({ where: { productId: id } })
      if (images && images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((img: any, idx: number) => ({
            productId: id,
            url: img.url,
            isPrimary: img.isPrimary,
            sortOrder: idx,
            altText: name
          }))
        })
      }

      // 3. Sync Variants
      // For variants, we might want to preserve IDs to avoid breaking OrderItem links if they exist,
      // but here we'll do a simple replace or upsert.
      // To be safe with existing orders, we should only delete variants that aren't in the new list.
      const existingVariants = await tx.productVariant.findMany({ where: { productId: id } })
      const incomingVariantIds = variants.map((v: any) => v.id).filter(Boolean)
      
      // Delete removed variants (careful: might fail if linked to orders)
      await tx.productVariant.deleteMany({
        where: { 
          productId: id,
          id: { notIn: incomingVariantIds }
        }
      }).catch(err => console.log("Some variants couldn't be deleted due to order history:", err))

      for (const v of variants) {
        if (v.id) {
          await tx.productVariant.update({
            where: { id: v.id },
            data: {
              size: v.size,
              color: v.color,
              stock: Number(v.stock),
              sku: v.sku || `${slug}-${v.size}`.toUpperCase(),
              price: v.price ? Number(v.price) : null
            }
          })
        } else {
          await tx.productVariant.create({
            data: {
              productId: id,
              size: v.size,
              color: v.color,
              stock: Number(v.stock),
              sku: v.sku || `${slug}-${v.size}-${Math.random().toString(36).slice(-4)}`.toUpperCase(),
              price: v.price ? Number(v.price) : null
            }
          })
        }
      }

      return product
    })

    return NextResponse.json(updatedProduct)
  } catch (error: any) {
    console.error("Product Update Error:", error)
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 })
  }
}
