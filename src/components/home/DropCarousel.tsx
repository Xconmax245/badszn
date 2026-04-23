import { getFeaturedCollections } from "@/lib/supabase/queries/collections"
import DropCarouselClient from "./DropCarouselClient"
import SectionDivider from "@/components/shared/SectionDivider"

export default async function DropCarousel() {
  const collections = await getFeaturedCollections()

  // Admin controls visibility — return null if nothing featured
  if (!collections.length) return null

  return (
    <section className="relative w-full bg-black py-16 md:py-24 overflow-hidden">
      
      {/* Subtle grain texture — matching Hero */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Editorial Header */}
      <div className="px-6 md:px-12 lg:px-20 mb-12 md:mb-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-12">
          <div>
            <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/20 block mb-5">
              Seasonal Capsules
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[-0.05em] uppercase text-white leading-[0.9]">
              The<br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.25)" }}
              >
                Drops
              </span>
            </h2>
          </div>
          
          <div className="max-w-xs pb-2">
             <p className="text-[12px] font-normal text-white/25 leading-relaxed">
               Limited edition collections, designed to be worn by the few. Each drop is a moment — once it&apos;s gone, it&apos;s gone.
             </p>
          </div>
        </div>

        {/* Thin separator line */}
        <div className="mt-8 md:mt-12 h-[1px] w-full bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-transparent" />
      </div>

      {/* Cinematic Client Carousel */}
      <DropCarouselClient collections={collections} />

      {/* Transition to next sector */}
      <div className="mt-16 md:mt-24">
        <SectionDivider variant="tear" fill="#000" />
      </div>
    </section>
  )
}
