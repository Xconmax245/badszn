import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Image from "next/image"
import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen">
      <main className="pt-32 pb-40">
        {/* ─── SECTION 01: THE MANIFESTO ─── */}
        <section className="px-6 md:px-12 lg:px-24 mb-40 md:mb-60">
          <div className="max-w-7xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-12 block">
              EST_2024 // THE_PHILOSOPHY
            </span>
            <h1 className="text-[clamp(2.5rem,8vw,7rem)] font-black uppercase text-white leading-[0.95] tracking-tighter mb-20 md:mb-32">
              We define the <br />
              <span className="text-transparent" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.4)" }}>Shadows of the Season</span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20">
              <div className="md:col-span-7">
                <p className="text-xl md:text-3xl font-black text-white/80 leading-relaxed uppercase tracking-tight">
                  BAD SZN is not a label. It is a biological response to the environment. We study the intersection of street utility and cinematic minimalism.
                </p>
                <div className="mt-12 h-[1px] w-24 bg-red-600" />
              </div>
              <div className="md:col-span-5 flex flex-col justify-end">
                <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.3em] leading-loose">
                  Our process begins where the day ends. We focus on silhouettes that command space and textures that survive the elements. Every piece is a fragment of a larger narrative.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 02: THE VISION (CINEMATIC) ─── */}
        <section className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden mb-40 md:mb-60">
          <Image 
            src="/images/photo_5994565660274527448_x.jpg"
            alt="Design Process"
            fill
            className="object-cover brightness-50 contrast-125"
          />
          <div className="absolute inset-0 bg-black/20 z-10" />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6 text-center">
            <h2 className="text-[12vw] font-black text-white/5 uppercase select-none tracking-tighter leading-none mb-4">
              INTENTIONAL
            </h2>
            <div className="max-w-lg">
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60 mb-6">Built for the Void</p>
               <p className="text-xs md:text-sm font-bold text-white uppercase tracking-widest leading-loose">
                 Uniforms for the modern nomad. Our designs are stripped of noise, leaving only the essential core of function and form.
               </p>
            </div>
          </div>
          
          {/* Grain overlay */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay z-15 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        </section>

        {/* ─── SECTION 03: THE ARCHIVE LOGIC ─── */}
        <section className="px-6 md:px-12 lg:px-24 mb-40">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
              {[
                { title: "Utility", desc: "Every zipper, pocket, and seam serves a purpose. We design for the reality of the streets, not just the aesthetic of them." },
                { title: "Silhoutte", desc: "Oversized, structured, and deliberate. Our pieces are designed to alter the wearer's presence in any environment." },
                { title: "Szn Control", desc: "Drop-based logic. We release collections that respond to the current climate, both environmental and cultural." }
              ].map((item, i) => (
                <div key={i} className="group">
                  <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.4em] mb-6 block">0{i + 1}_LOGIC</span>
                  <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-6 group-hover:text-red-600 transition-colors duration-500">
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.25em] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
           </div>
        </section>

        {/* ─── FINAL CALL ─── */}
        <section className="px-6 text-center border-t border-white/5 pt-40">
           <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-12">
             Enter the <span className="italic">SZN</span>
           </h2>
           <a 
            href="/shop" 
            className="inline-flex items-center justify-center px-12 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-white/90 transition-all hover:scale-110 active:scale-95"
           >
             Explore Shop
           </a>
        </section>
      </main>
    </div>
  )
}
