import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminRequest } from "@/lib/auth/admin"

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const variants = await prisma.productVariant.findMany({
    where: { stock: { lte: 5 } },
    orderBy: { stock: "asc" },
    include: {
      product: {
        select: {
          name:   true,
          slug:   true,
          images: {
            where:   { isPrimary: true },
            take:    1,
            select:  { url: true },
          },
        },
      },
    },
  })

  const formatted = variants.map((v) => ({
    variantId:   v.id,
    sku:         v.sku,
    size:        v.size,
    color:       v.color,
    stock:       v.stock,
    status:      v.stock === 0 ? "Out of Stock" : v.stock < 3 ? "Critical" : "Low",
    productName: v.product.name,
    productSlug: v.product.slug,
    imageUrl:    v.product.images[0]?.url ?? null,
  }))

  return NextResponse.json({ variants: formatted })
}
