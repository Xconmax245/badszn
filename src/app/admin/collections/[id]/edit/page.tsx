import { prisma } from "@/lib/prisma"
import CollectionForm from "@/components/admin/CollectionForm"
import { notFound } from "next/navigation"

export default async function EditCollectionPage({ params }: { params: { id: string } }) {
  const collection = await prisma.collection.findUnique({
    where: { id: params.id }
  })

  if (!collection) {
    notFound()
  }

  return (
    <div className="animate-in fade-in duration-1000">
      <CollectionForm initialData={collection} />
    </div>
  )
}
