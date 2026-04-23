import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Image from "next/image"
import Link from "next/link"
import { formatNaira } from "@/lib/utils/formatCurrency"

export default async function CollectionDetailPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const collection = await prisma.collection.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1
              }
            }
          }
        },
        orderBy: { sortOrder: "asc" }
      }
    }
  })

  if (!collection) notFound()

  return (
    <div className="bg-black min-h-screen">
      <main>
        {/* ─── COLLECTION HERO ─── */}
        <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
          <Image 
            src={collection.imageUrl || "/placeholder-collection.jpg"}
            alt={collection.name}
            fill
            priority
            className="object-cover brightness-[0.3]"
          />
          <div className="relative z-10 text-center px-6">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40 mb-4 block">
              SEASON_COLLECTION
            </span>
            <h1 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none mb-6">
              {collection.name}
            </h1>
            <p className="max-w-xl mx-auto text-[11px] font-bold text-white/50 uppercase tracking-[0.2em] leading-relaxed">
              {collection.description}
            </p>
          </div>
          
          {/* Bottom Gradient Fade */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </section>

        {/* ─── PRODUCT GRID ─── */}
        <section className="px-6 md:px-12 lg:px-24 py-24">
          <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-8">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">
              Pieces_Registry <span className="text-white/20 ml-2">({collection.products.length})</span>
            </h2>
            <div className="hidden md:flex gap-4">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/20 italic">Curated Selection for the Season</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-20">
            {collection.products.map(({ product }, idx) => (
              <Link 
                key={product.id}
                href={`/shop/${product.slug}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-white/[0.02] rounded-2xl md:rounded-[2.5rem] border border-white/5 mb-6">
                  {product.images[0] && (
                    <Image 
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                    />
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="text-[9px] font-black text-white uppercase tracking-[0.3em] bg-black/40 backdrop-blur-xl px-6 py-3 border border-white/10 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      View Details
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 px-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[11px] font-black text-white uppercase tracking-widest leading-tight flex-1">
                      {product.name}
                    </h3>
                    <span className="font-mono text-[11px] text-white/40">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-[13px] font-black text-white">
                    {formatNaira(Number(product.basePrice))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          {collection.products.length === 0 && (
            <div className="py-32 text-center opacity-20">
              <p className="text-[11px] font-black uppercase tracking-widest">Collection currently empty</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
