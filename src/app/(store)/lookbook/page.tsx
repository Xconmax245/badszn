import { prisma } from "@/lib/prisma"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { LookbookLayoutType } from "@prisma/client"

export default async function LookbookPage() {
  const entries = await prisma.lookbookEntry.findMany({
    where: { isPublished: true },
    include: {
      products: {
        include: {
          product: true
        }
      }
    },
    orderBy: { sortOrder: "asc" }
  })

  // Mapping layout types to tailwind classes
  const getLayoutClasses = (type: LookbookLayoutType) => {
    switch (type) {
      case "SMALL":     return "col-span-1 row-span-1 h-[300px] md:h-[400px]"
      case "MEDIUM":    return "col-span-1 row-span-1 h-[400px] md:h-[550px]"
      case "LARGE":     return "col-span-1 md:col-span-2 row-span-1 h-[400px] md:h-[600px]"
      case "OVERSIZED": return "col-span-1 md:col-span-2 row-span-2 h-[600px] md:h-[900px]"
      default:          return "col-span-1 h-[400px]"
    }
  }

  return (
    <div className="bg-black min-h-screen">
      <main className="pt-32 pb-40 px-6 md:px-12 lg:px-24">
        {/* ─── HEADER ─── */}
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 mb-6 block">Visual_Documentation</span>
            <h1 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none mb-8">
              The <br />
              <span className="text-transparent" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.3)" }}>Lookbook</span>
            </h1>
          </div>
          <div className="pb-4">
             <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.3em] leading-relaxed max-w-xs">
              A chronological study of silhouette, texture, and movement.
            </p>
          </div>
        </div>

        {/* ─── STAGGERED GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 auto-rows-auto">
          {entries.map((entry, idx) => (
            <div 
              key={entry.id}
              className={`group relative overflow-hidden bg-white/[0.02] rounded-3xl border border-white/5 ${getLayoutClasses(entry.layoutType)}`}
            >
              <Image 
                src={entry.imageUrl}
                alt={entry.title || `Look ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
              />
              
              {/* Hotspots / Tag Indicators */}
              <div className="absolute inset-0 z-10">
                {entry.products.map((item) => (
                  <div 
                    key={item.id}
                    className="absolute group/hotspot cursor-pointer"
                    style={{ left: `${item.xPosition}%`, top: `${item.yPosition}%` }}
                  >
                    {/* Hotspot Pulse */}
                    <div className="relative">
                      <div className="absolute -inset-2 bg-white/20 rounded-full animate-ping" />
                      <div className="relative w-3 h-3 bg-white rounded-full border border-black shadow-2xl" />
                    </div>

                    {/* Product Preview Card */}
                    <Link 
                      href={`/shop/${item.product.slug}`}
                      className="absolute left-6 top-1/2 -translate-y-1/2 w-48 p-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl opacity-0 group-hover/hotspot:opacity-100 translate-x-4 group-hover/hotspot:translate-x-0 transition-all duration-500 pointer-events-none group-hover/hotspot:pointer-events-auto"
                    >
                      <p className="text-[10px] font-black text-white uppercase tracking-wider mb-1">{item.product.name}</p>
                      <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Shop Item →</p>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute bottom-8 left-8">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] block mb-2">Registry_No.{String(idx + 1).padStart(2, '0')}</span>
                  <h3 className="text-[14px] font-black text-white uppercase tracking-widest">{entry.title || "Untitled Fragment"}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {entries.length === 0 && (
          <div className="py-40 text-center text-white/20">
            <p className="text-[11px] font-black uppercase tracking-[0.5em]">The archive is currently being updated</p>
          </div>
        )}
      </main>
    </div>
  )
}
