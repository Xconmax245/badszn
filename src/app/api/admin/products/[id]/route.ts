import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const data = await request.json();
    
    // We only update top-level fields in this PATCH
    // Complex variant/image editing usually requires specific sub-endpoints or a more complex strategy
    // For now, we'll handle basic fields to make the editor functional
    const { 
      name, 
      slug, 
      description, 
      basePrice, 
      compareAtPrice, 
      categoryId, 
      status, 
      isNew, 
      isFeatured, 
      isBestSeller,
      material,
      fit,
      careInstructions,
      collectionId
    } = data;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        slug,
        description,
        basePrice: basePrice || undefined,
        compareAtPrice: compareAtPrice || undefined,
        categoryId,
        ...(collectionId !== undefined ? {
          collections: {
            deleteMany: {},
            ...(collectionId ? { create: [{ collectionId }] } : {})
          }
        } : {}),
        status,
        isNew,
        isFeatured,
        isBestSeller,
        material,
        fit,
        careInstructions
      },
      include: {
        images: true,
        variants: true
      }
    });

    revalidatePath("/shop");
    revalidatePath("/");

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("❌ Product Update Error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    // We use a safe delete or status change? 
    // The user requested Lifecycle status and operational capacity.
    // I'll implement a hard delete but typically we'd archive.
    await prisma.product.delete({
      where: { id: productId }
    });

    revalidatePath("/shop");
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Product Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
