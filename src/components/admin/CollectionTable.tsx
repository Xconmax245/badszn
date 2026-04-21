"use client"

import { useState } from "react"
import { 
  Edit2, 
  Trash2, 
  Layers, 
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Check,
  X,
  Plus
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

interface CollectionTableProps {
  initialCollections: any[]
}

export default function CollectionTable({ initialCollections }: CollectionTableProps) {
  const [collections, setCollections] = useState(initialCollections)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()

  const handleToggle = async (id: string, field: string, currentValue: boolean) => {
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/collections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue })
      })

      if (!res.ok) throw new Error("Failed to update")
      
      const updated = await res.json()
      setCollections(collections.map(c => c.id === id ? { ...c, ...updated } : c))
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingId(null)
    }
  }

  const handlePositionChange = async (id: string, newOrder: number) => {
    try {
      const res = await fetch("/api/admin/collections/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, newOrder, isFeatured: true })
      })

      if (!res.ok) throw new Error("Failed to reorder")
      
      router.refresh()
      // We don't update local state here because reorder affects multiple rows. 
      // Refreshing the page is cleaner.
      window.location.reload() 
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return
    
    try {
      const res = await fetch(`/api/admin/collections/${id}`, {
        method: "DELETE"
      })

      if (!res.ok) throw new Error("Failed to delete")
      
      setCollections(collections.filter(c => c.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Campaign</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Visibility</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Engagement</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {collections.map((collection) => (
              <tr key={collection.id} className="group hover:bg-white/[0.01] transition-colors">
                <td className="px-8 py-8">
                  <div className="flex items-center gap-6">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                      {collection.imageUrl ? (
                        <Image 
                          src={collection.imageUrl} 
                          alt={collection.name} 
                          fill 
                          className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Layers className="w-6 h-6 text-white/5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-black uppercase tracking-tight text-white mb-1">{collection.name}</h4>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.1em]">{collection.slug}</p>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-8">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col gap-1 w-20">
                         <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Live</span>
                         <button 
                           onClick={() => handleToggle(collection.id, "isActive", collection.isActive)}
                           className={`w-10 h-5 rounded-full relative transition-colors ${collection.isActive ? "bg-emerald-500" : "bg-white/10"}`}
                         >
                            <div className={`absolute top-1 bottom-1 w-3 h-3 bg-white rounded-full transition-all ${collection.isActive ? "left-6" : "left-1"}`} />
                         </button>
                      </div>

                      <div className="flex flex-col gap-1 w-20">
                         <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Featured</span>
                         <button 
                           onClick={() => handleToggle(collection.id, "isFeatured", collection.isFeatured)}
                           className={`w-10 h-5 rounded-full relative transition-colors ${collection.isFeatured ? "bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.4)]" : "bg-white/10"}`}
                         >
                            <div className={`absolute top-1 bottom-1 w-3 h-3 bg-white rounded-full transition-all ${collection.isFeatured ? "left-6" : "left-1"}`} />
                         </button>
                      </div>

                      <AnimatePresence>
                        {collection.isFeatured && (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex flex-col gap-1"
                          >
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Pos</span>
                            <input 
                              type="number"
                              defaultValue={collection.featuredOrder}
                              onBlur={(e) => {
                                const val = parseInt(e.target.value)
                                if (val !== collection.featuredOrder) {
                                  handlePositionChange(collection.id, val)
                                }
                              }}
                              className="w-12 bg-white/5 border border-white/10 rounded px-2 py-0.5 text-[11px] font-black text-white focus:outline-none focus:border-white/20"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-8 text-[12px] font-bold text-white/40 uppercase tracking-widest italic">
                  {collection._count?.products || 0} Artifacts
                </td>

                <td className="px-8 py-8 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
                    <Link 
                      href={`/admin/collections/${collection.id}/edit`}
                      className="p-3 bg-white/5 border border-white/10 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(collection.id)}
                      className="p-3 bg-white/5 border border-white/10 rounded-full text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
