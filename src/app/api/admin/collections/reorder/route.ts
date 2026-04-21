import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { revalidateTag } from "next/cache"
import { verifyAdminRequest } from "@/lib/auth/admin"

export async function POST(req: Request) {
  const admin = await verifyAdminRequest(req)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, newOrder, isFeatured } = await req.json()

    // Validate inputs
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 })
    }

    await prisma.$transaction(async (tx) => {
      // If unfeaturing — just clear this item's order and exit
      if (!isFeatured) {
        await tx.collection.update({
          where: { id },
          data: { isFeatured: false, featuredOrder: null },
        })

        // Rebuild remaining featured items to ensure no gaps
        const remaining = await tx.collection.findMany({
          where: { isFeatured: true },
          orderBy: { featuredOrder: "asc" },
        })

        for (let i = 0; i < remaining.length; i++) {
          await tx.collection.update({
            where: { id: remaining[i].id },
            data: { featuredOrder: i + 1 },
          })
        }

        return
      }

      // If featuring — Rebuild the list with the new item inserted
      // 1. Get all currently featured items except the one being moved
      const all = await tx.collection.findMany({
        where: {
          isFeatured: true,
          id: { not: id },
        },
        orderBy: { featuredOrder: "asc" },
      })

      // 2. Clamp position to valid range
      const safeIndex = Math.max(
        0,
        Math.min((newOrder ?? all.length + 1) - 1, all.length)
      )

      // 3. Create a pseudo-list for re-ordering
      const reorderedList = [...all]
      reorderedList.splice(safeIndex, 0, { id } as any)

      // 4. Update every item in the sequence to ensure absolute integrity
      for (let i = 0; i < reorderedList.length; i++) {
        await tx.collection.update({
          where: { id: reorderedList[i].id },
          data: {
            isFeatured:    true,
            featuredOrder: i + 1,
          },
        })
      }
    })

    // Surgical cache invalidation — only carousel updates
    revalidateTag("featured-collections")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[REORDER_ERROR]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
