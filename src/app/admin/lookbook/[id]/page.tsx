import { prisma } from "@/lib/prisma"
import LookbookForm from "@/components/admin/LookbookForm"
import { notFound } from "next/navigation"

export default async function EditLookbookEntryPage({ params }: { params: { id: string } }) {
  const entry = await prisma.lookbookEntry.findUnique({
    where: { id: params.id }
  })

  if (!entry) {
     notFound()
  }

  return (
    <div className="space-y-6">
      <LookbookForm initialData={entry} />
    </div>
  )
}
