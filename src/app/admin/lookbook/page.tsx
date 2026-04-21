import { prisma } from "@/lib/prisma"
import { 
  Camera, 
  Plus, 
  MapPin, 
  Eye, 
  Trash2, 
  Maximize2
} from "lucide-react"
import Link from "next/link"

export default async function AdminLookbookPage() {
  const entries = await prisma.lookbookEntry.findMany({
    include: {
      _count: { select: { products: true } }
    },
    orderBy: { sortOrder: "asc" }
  })

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Atmospheric Lookbook</h1>
           <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 italic">Curate the brand's visual narrative and product hotspots.</p>
        </div>
        
        <Link 
          href="/admin/lookbook/new"
          className="bg-white text-black py-3 px-8 rounded-full flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" /> Upload Visual
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {entries.length === 0 ? (
          <div className="col-span-full py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-4 text-white/20">
            <Camera className="w-12 h-12" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">No visual narratives captured</p>
          </div>
        ) : (
          entries.map((entry: any) => (
            <div key={entry.id} className="group relative bg-[#111111] border border-white/[0.05] rounded-3xl overflow-hidden hover:border-white/10 transition-all duration-500">
               <div className="aspect-[4/5] relative bg-white/[0.02]">
                  <img src={entry.imageUrl} alt={entry.title || "Lookbook Entry"} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Status Overlay */}
                  <div className="absolute top-4 left-4 flex gap-2">
                     <div className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-md border ${entry.isPublished ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-white/10 text-white/40 border-white/10"}`}>
                        {entry.isPublished ? "PUBLISHED" : "DRAFT"}
                     </div>
                  </div>

                  {/* Hotspot Count Indicator */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-2">
                     <MapPin className="w-3 h-3 text-accent-red" />
                     <span className="text-[10px] font-black text-white">{entry._count.products} HOTSPOTS</span>
                  </div>

                  {/* Action Overlays */}
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-between">
                     <Link 
                       href={`/admin/lookbook/${entry.id}`}
                       className="bg-white text-black py-2.5 px-5 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                     >
                       Edit Hotspots
                     </Link>
                     <div className="flex gap-2">
                        <button className="p-2.5 rounded-full bg-white/10 text-white/60 hover:text-white transition-all"><Maximize2 className="w-4 h-4" /></button>
                        <button className="p-2.5 rounded-full bg-white/10 text-white/60 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  </div>
               </div>
               
                <div className="p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-white truncate">{entry.title || "UNTITLED_VISUAL"}</h3>
                  <div className="flex flex-col gap-1 mt-3">
                    <div className="flex items-center gap-2 text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">
                       <span className="text-[var(--accent-red)]">Seq_{entry.sortOrder}</span>
                       <span className="w-1 h-1 rounded-full bg-white/10" />
                       <span>Layout: {entry.layoutType}</span>
                    </div>
                    {(entry.sequenceGroup) && (
                      <div className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">
                        Group: {entry.sequenceGroup}
                      </div>
                    )}
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
