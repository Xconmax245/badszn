"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import type { CarouselCollection } from "@/lib/supabase/queries/collections"

const EASE = [0.22, 1, 0.36, 1] as const

export default function DropCarouselItem({
  collection,
  isActive,
  index,
  onClick,
}: {
  collection: CarouselCollection
  isActive:   boolean
  index:      number
  onClick:    () => void
}) {
  const orderLabel = String(index + 1).padStart(2, "0")

  return (
    <motion.div
      onClick={onClick}
      animate={{
        scale:   isActive ? 1 : 0.92,
        opacity: isActive ? 1 : 0.35,
      }}
      transition={{ duration: 0.7, ease: EASE }}
      className="
        flex-shrink-0
        w-[85vw] sm:w-[75vw] md:w-[70vw] lg:w-[60vw]
        cursor-pointer relative
      "
      style={{ scrollSnapAlign: "center" }}
      data-carousel-item
    >
      <Link
        href="/shop"
        onClick={(e) => !isActive && e.preventDefault()}
        className="block group"
      >
        {/* ═══ Main Image ═══ */}
        <div className="relative w-full aspect-[16/9] md:aspect-[2/1] overflow-hidden bg-zinc-950">
          {collection.imageUrl ? (
            <Image
              src={collection.imageUrl}
              alt={collection.name}
              fill
              sizes="(max-width: 640px) 85vw, (max-width: 768px) 75vw, 60vw"
              className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              quality={90}
            />
          ) : (
            <div className="w-full h-full bg-zinc-950 flex items-center justify-center">
              <span className="text-white/5 text-xs font-medium tracking-widest uppercase">
                No Image
              </span>
            </div>
          )}

          {/* Cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />

          {/* Large background index number */}
          <div className="absolute top-4 right-6 md:top-6 md:right-10 pointer-events-none select-none">
            <span
              className="text-[80px] md:text-[120px] lg:text-[160px] font-black leading-none tracking-[-0.06em]"
              style={{
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.06)",
              }}
            >
              {orderLabel}
            </span>
          </div>

          {/* Bottom content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8">
              {/* Left: Title + Description */}
              <div className="flex-1 min-w-0">
                <motion.h3
                  animate={{ opacity: isActive ? 1 : 0.4 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-[-0.04em] uppercase text-white leading-[0.95]"
                >
                  {collection.name}
                </motion.h3>

                {isActive && collection.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
                    className="text-[13px] text-white/40 mt-3 max-w-md leading-relaxed font-medium"
                  >
                    {collection.description}
                  </motion.p>
                )}
              </div>

              {/* Right: CTA + Meta */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5, ease: EASE }}
                  className="flex items-center gap-6 flex-shrink-0"
                >
                  <span className="
                    inline-flex items-center gap-2
                    px-6 py-3
                    bg-white text-black
                    text-[11px] font-bold tracking-[0.15em] uppercase
                    hover:bg-[var(--accent-red)] hover:text-white
                    transition-all duration-500
                  ">
                    Shop Now →
                  </span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Top-left collection label */}
          {isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="absolute top-6 left-6 md:top-8 md:left-10"
            >
              <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-white/30">
                Drop {orderLabel}
              </span>
            </motion.div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
