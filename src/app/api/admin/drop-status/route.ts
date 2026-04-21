import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminRequest } from "@/lib/auth/admin"

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const collection = await prisma.collection.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      products: {
        include: {
          product: { select: { id: true, name: true, status: true } },
        },
      },
      waitlist: { select: { id: true } },
    },
  })

  if (!collection) {
    return NextResponse.json({ drop: null })
  }

  return NextResponse.json({
    drop: {
      id:           collection.id,
      name:         collection.name,
      slug:         collection.slug,
      launchDate:   collection.launchDate?.toISOString() ?? null,
      waitlistCount: collection.waitlist.length,
      productCount: collection.products.length,
      buildId:      process.env.NEXT_PUBLIC_BUILD_ID ?? "DEV",
    },
  })
}
