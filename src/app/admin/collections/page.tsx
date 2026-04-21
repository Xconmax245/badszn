import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus } from "lucide-react"
import CollectionTable from "@/components/admin/CollectionTable"

export default async function AdminCollectionsPage() {
  const collections = await prisma.collection.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* ─── HEADER ACTIONS ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
           <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-2 italic">
              Registry // ARCHIVE_DROPS
           </div>
           <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Campaigns</h1>
        </div>

        <Link 
          href="/admin/collections/new"
          className="bg-white text-black py-4 px-10 rounded-full flex items-center justify-center gap-3 text-[12px] font-black uppercase tracking-[0.2em] hover:bg-white/90 active:scale-95 transition-all shadow-2xl"
        >
          <Plus className="w-4 h-4" /> Initialize Campaign
        </Link>
      </div>

      {/* ─── COLLECTION TABLE ────────────────────────────────── */}
      <CollectionTable initialCollections={collections} />
    </div>
  )
}
