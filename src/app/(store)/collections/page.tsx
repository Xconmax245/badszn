import { prisma } from "@/lib/prisma"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Box } from "lucide-react"

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { featuredOrder: "asc" }
  })

  return (
    <div className="bg-black min-h-screen">
      <main className="pt-32 pb-40">
        {/* ─── HERO HEADER ─── */}
        <div className="px-6 md:px-12 lg:px-24 mb-24 md:mb-36">
          <div className="relative">
            <span className="absolute -top-20 left-0 text-[18vw] font-black uppercase text-white/[0.02] select-none pointer-events-none tracking-tighter leading-none">
              Archive
            </span>
            <h1 className="text-[clamp(3.5rem,10vw,8rem)] font-black uppercase text-white leading-[0.9] tracking-tighter">
              The <br />
              <span className="text-transparent" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.3)" }}>Collections</span>
            </h1>
            <div className="mt-8 md:mt-12 max-w-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40 leading-relaxed">
                Curated drops and seasonal capsules. Each collection is a distinct narrative within the BAD SZN universe.
              </p>
            </div>
          </div>
        </div>

        {/* ─── FULL-WIDTH GRID ─── */}
        <div className="flex flex-col gap-2">
          {collections.map((collection, idx) => (
            <Link 
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group relative w-full h-[60vh] md:h-[80vh] overflow-hidden flex items-center justify-center"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image 
                  src={collection.imageUrl || "/placeholder-collection.jpg"}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                
                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-1000 z-10" />
                <div className="absolute inset-0 opacity-10 mix-blend-overlay z-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
              </div>

              {/* Content Overlay */}
              <div className="relative z-20 w-full px-6 md:px-12 lg:px-24 flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="max-w-3xl transform group-hover:-translate-y-4 transition-transform duration-700">
                   <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Volume_{String(idx + 1).padStart(2, '0')}</span>
                    <div className="h-[1px] w-12 bg-white/20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/80">{collection._count.products} Items</span>
                  </div>
                  <h2 className="text-5xl md:text-8xl lg:text-[10rem] font-black text-white uppercase leading-none tracking-tighter mb-6">
                    {collection.name}
                  </h2>
                  <p className="text-xs md:text-sm font-bold text-white/60 uppercase tracking-widest leading-relaxed max-w-lg opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                    {collection.description}
                  </p>
                </div>

                <div className="flex-shrink-0 mb-4 transform translate-y-20 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                  <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-500 hover:scale-110">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                </div>
              </div>

              {/* Index Number (Bottom Left) */}
              <div className="absolute bottom-10 left-10 z-20 hidden md:block">
                <span className="text-[120px] font-black text-white/5 leading-none select-none tracking-tighter">
                   {String(idx + 1).padStart(2, '0')}
                </span>
              </div>
            </Link>
          ))}
          
          {collections.length === 0 && (
            <div className="py-40 text-center flex flex-col items-center gap-6 opacity-20">
              <Box className="w-12 h-12" />
              <p className="text-[11px] font-black uppercase tracking-[0.5em]">No collections launched</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
