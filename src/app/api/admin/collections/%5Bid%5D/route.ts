import { NextRequest, NextResponse } from "next/server"
import { updateCollectionAndReorder } from "@/lib/actions/collections"
import { getAdminSession } from "@/lib/auth/admin"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const updated = await updateCollectionAndReorder(params.id, data)

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("[COLLECTION_UPDATE_ERROR]:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update collection" },
      { status: 500 }
    )
  }
}
