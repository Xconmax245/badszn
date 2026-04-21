import { prisma } from "@/lib/prisma"
import CollectionEditor from "@/components/admin/CollectionEditor"
import { notFound } from "next/navigation"

export default async function adminCollectionEditorPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "new"
  
  let initialData = null

  if (!isNew) {
    initialData = await prisma.collection.findUnique({
      where: { id: params.id },
      include: {
        _count: { select: { products: true } }
      }
    })

    if (!initialData) {
      notFound()
    }
  }

  return (
    <CollectionEditor initialData={initialData} />
  )
}
