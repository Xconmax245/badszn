import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, imageUrl, layoutType, sequenceGroup, sortOrder, isPublished } = body

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    const entry = await prisma.lookbookEntry.create({
      data: {
        title: title || null,
        imageUrl,
        layoutType: layoutType || "MEDIUM",
        sequenceGroup: sequenceGroup || null,
        sortOrder: Number(sortOrder) || 1,
        isPublished: Boolean(isPublished),
      }
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error("DEBUG - Lookbook API POST Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
