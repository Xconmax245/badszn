import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { title, imageUrl, layoutType, sequenceGroup, sortOrder, isPublished } = body

    const entry = await prisma.lookbookEntry.update({
      where: { id: params.id },
      data: {
        title: title || null,
        imageUrl,
        layoutType,
        sequenceGroup: sequenceGroup || null,
        sortOrder: Number(sortOrder) || 0,
        isPublished: Boolean(isPublished),
      }
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error("DEBUG - Lookbook API PATCH Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.lookbookEntry.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DEBUG - Lookbook API DELETE Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
