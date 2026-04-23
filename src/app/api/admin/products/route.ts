import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const data = await request.json();
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
      collectionId,
      images, // [{ url, altText, isPrimary, sortOrder }]
      variants // [{ size, color, sku, stock, price }]
    } = data;

    // 1. Validate mandatory fields
    if (!name || !slug || !categoryId || !basePrice) {
      return NextResponse.json({ error: "Missing required product fields" }, { status: 400 });
    }

    // 2. Process variants and generate SKUs if missing
    const processedVariants = variants.map((v: any) => {
      const generatedSku = v.sku || `${name}-${v.size}-${v.color || "DEFAULT"}`.toUpperCase().replace(/\s+/g, "-");
      return {
        ...v,
        sku: generatedSku,
        price: v.price ? v.price : null,
        stock: parseInt(v.stock) || 0
      };
    });

    // 3. Uniqueness Check for SKUs
    const skus = processedVariants.map((v: any) => v.sku);
    const existingVariant = await prisma.productVariant.findFirst({
      where: { sku: { in: skus } }
    });

    if (existingVariant) {
      return NextResponse.json({ error: `SKU collision detected: ${existingVariant.sku} already exists.` }, { status: 400 });
    }

    // 4. Create Product with nested relations in a transaction
    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        basePrice: basePrice,
        compareAtPrice: compareAtPrice || null,
        categoryId,
        status,
        isNew: !!isNew,
        isFeatured: !!isFeatured,
        isBestSeller: !!isBestSeller,
        material,
        fit,
        careInstructions,
        ...(collectionId ? {
          collections: {
            create: [{ collectionId }]
          }
        } : {}),
        images: {
          create: images.map((img: any) => ({
            url: img.url,
            altText: img.altText || name,
            isPrimary: !!img.isPrimary,
            sortOrder: img.sortOrder || 0
          }))
        },
        variants: {
          create: processedVariants.map((v: any) => ({
            size: v.size,
            color: v.color,
            sku: v.sku,
            stock: v.stock,
            price: v.price
          }))
        }
      },
      include: {
        images: true,
        variants: true
      }
    });

    revalidatePath("/shop");
    revalidatePath("/"); // in case they appear on the homepage

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("❌ Product Creation Error:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Product slug or SKU must be unique" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
