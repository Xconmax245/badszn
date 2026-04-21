import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminRequest } from "@/lib/auth/admin"
import { revalidateTag } from "next/cache"

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const collections = await prisma.collection.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(collections)
  } catch (error) {
    console.error("[COLLECTIONS_GET_ERROR]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const admin = await verifyAdminRequest(req)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { 
      name, 
      slug, 
      description, 
      imageUrl, 
      isActive, 
      isFeatured, 
      featuredOrder, 
      launchDate 
    } = body

    if (!name || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        isActive,
        isFeatured,
        featuredOrder: isFeatured ? (featuredOrder || 1) : null,
        launchDate: launchDate ? new Date(launchDate) : null,
      }
    })

    if (isFeatured) {
       revalidateTag("featured-collections")
    }

    return NextResponse.json(collection)
  } catch (error) {
    console.error("[COLLECTION_POST_ERROR]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
