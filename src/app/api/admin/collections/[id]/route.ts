import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminRequest } from "@/lib/auth/admin"
import { revalidateTag } from "next/cache"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdminRequest(req)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const collection = await prisma.collection.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    return NextResponse.json(collection)
  } catch (error) {
    console.error("[COLLECTION_GET_SINGLE_ERROR]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const collection = await prisma.collection.update({
      where: { id: params.id },
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
    
    // Always revalidate to ensure homepage reflects any changes (name, image, featured status)
    revalidateTag("featured-collections")

    return NextResponse.json(collection)
  } catch (error) {
    console.error("[COLLECTION_PATCH_ERROR]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdminRequest(req)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await prisma.collection.delete({
      where: { id: params.id }
    })

    revalidateTag("featured-collections")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[COLLECTION_DELETE_ERROR]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
