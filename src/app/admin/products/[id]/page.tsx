import { prisma } from "@/lib/prisma"
import ProductForm from "@/components/admin/ProductForm"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ProductEditorPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "new"
  
  // Fetch required reference data
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } })
  const collections = await prisma.collection.findMany({ orderBy: { createdAt: "desc" } })

  let initialData = null

  if (!isNew) {
    initialData = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        category: true,
      }
    })

    if (!initialData) {
      notFound()
    }
  }

  return (
    <div className="space-y-10">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            href="/admin/products" 
            className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-white hover:border-white/20 transition-all"
            data-cursor="hover"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1 italic">
              Archive_Registry // {isNew ? "NEW_ENTRY" : "EDIT_MODE"}
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">
              {isNew ? "Create Product" : initialData?.name}
            </h1>
          </div>
        </div>
      </div>

      {/* The Engine Room (Form) */}
      <ProductForm 
        initialData={initialData} 
        categories={categories}
        collections={collections}
      />
    </div>
  )
}
