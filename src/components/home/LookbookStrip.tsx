"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"

// ── Types ─────────────────────────────────────
export type LookbookLayoutType = "SMALL" | "MEDIUM" | "LARGE" | "OVERSIZED"

export interface StripEntry {
  id: string
  imageUrl: string
  title: string | null
  layoutType: LookbookLayoutType
}

interface LookbookStripProps {
  entries: StripEntry[]
}

// ── Premium easing ────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const

// ── Height map for the staggered masonry feel ─
const HEIGHT_MAP: Record<LookbookLayoutType, string> = {
  SMALL:     "h-[280px] md:h-[380px]",
  MEDIUM:    "h-[320px] md:h-[450px]",
  LARGE:     "h-[380px] md:h-[520px]",
  OVERSIZED: "h-[420px] md:h-[600px]",
}

const WIDTH_MAP: Record<LookbookLayoutType, string> = {
  SMALL:     "w-[55vw] md:w-[240px]",
  MEDIUM:    "w-[68vw] md:w-[340px]",
  LARGE:     "w-[82vw] md:w-[480px]",
  OVERSIZED: "w-[90vw] md:w-[620px]",
}

export default function LookbookStrip({ entries }: LookbookStripProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollRef  = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // ── Cursor tracking for magnetic pull ───────
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const smoothCursorX = useSpring(cursorX, { stiffness: 120, damping: 30 })
  const smoothCursorY = useSpring(cursorY, { stiffness: 120, damping: 30 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    cursorX.set(((e.clientX - rect.left) / rect.width - 0.5) * 20)
    cursorY.set(((e.clientY - rect.top) / rect.height - 0.5) * 12)
  }, [cursorX, cursorY])

  // ── Scroll-driven parallax for section entry ─
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const sectionOpacity   = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  const headerY          = useTransform(scrollYProgress, [0, 0.2], [60, 0])
  const watermarkX       = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"])
  const watermarkOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.025, 0.025, 0])

  // ── IntersectionObserver for active frame ────
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const items = Array.from(container.querySelectorAll("[data-strip-item]"))

    const observer = new IntersectionObserver(
      (observed) => {
        observed.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"))
            setActiveIndex(index)
          }
        })
      },
      {
        root: container,
        rootMargin: "0px -38% 0px -38%",
        threshold: 0.2,
      }
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [entries])

  // ── Track first scroll to hide hint ──────────
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const onScroll = () => {
      if (container.scrollLeft > 30) setHasScrolled(true)
    }

    container.addEventListener("scroll", onScroll, { passive: true })
    return () => container.removeEventListener("scroll", onScroll)
  }, [])

  if (!entries || entries.length === 0) return null

  // ── Progress ratio ──────────────────────────
  const total = entries.length

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity: sectionOpacity }}
      className="relative w-full bg-black overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* ═══════════════════════════════════════════
          LAYER 0 — Grain texture (matches Hero)
          ═══════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-0 pointer-events-none mix-blend-overlay"
        style={{
          opacity: 0.08,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />

      {/* ═══════════════════════════════════════════
          LAYER 1 — Ghost watermark (matches Ethos)
          ═══════════════════════════════════════════ */}
      <motion.span
        aria-hidden
        className="absolute left-0 top-1/2 -translate-y-1/2 text-[22vw] font-black tracking-[-0.06em] uppercase text-white select-none pointer-events-none leading-none z-[1]"
        style={{
          opacity: watermarkOpacity,
          x: watermarkX,
        }}
      >
        ARCHIVE
      </motion.span>

      {/* ═══════════════════════════════════════════
          LAYER 2 — Section header
          ═══════════════════════════════════════════ */}
      <motion.div
        style={{ y: headerY }}
        className="relative z-10 px-8 md:px-16 lg:px-24 pt-28 pb-16 md:pt-36 md:pb-20"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="block mb-4 text-[10px] font-bold tracking-[0.35em] uppercase text-white/25"
            >
              Visual Narrative
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
              className="text-[clamp(2.5rem,7vw,5rem)] font-black tracking-[-0.04em] uppercase text-white leading-[0.95]"
            >
              The <span className="text-transparent" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.5)" }}>Lookbook</span>
            </motion.h2>
          </div>

          {/* Scroll hint */}
          <AnimatePresence>
            {!hasScrolled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="hidden md:flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] uppercase text-white/30"
              >
                <span className="w-8 h-[1px] bg-white/20" />
                Drag to explore
                <motion.span
                  animate={{ x: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Thin accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
          className="h-[1px] bg-gradient-to-r from-white/20 via-white/5 to-transparent mt-10 origin-left"
        />
      </motion.div>

      {/* ═══════════════════════════════════════════
          LAYER 3 — The horizontal strip
          ═══════════════════════════════════════════ */}
      <div className="relative w-full z-10">
        {/* Edge fade masks */}
        <div className="absolute inset-y-0 left-0 w-12 md:w-40 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 md:w-40 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />

        <div
          ref={scrollRef}
          className="flex items-end gap-5 md:gap-8 overflow-x-auto snap-x snap-mandatory px-[15vw] md:px-[18vw] pb-8"
          style={{
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {entries.map((entry, idx) => {
            const isActive  = idx === activeIndex
            const isHovered = idx === hoveredIndex
            const widthClass  = WIDTH_MAP[entry.layoutType] || WIDTH_MAP.MEDIUM
            const heightClass = HEIGHT_MAP[entry.layoutType] || HEIGHT_MAP.MEDIUM

            // Stagger vertical alignment for editorial asymmetry
            const offsetClass = idx % 3 === 0
              ? "mb-0"
              : idx % 3 === 1
                ? "mb-12 md:mb-20"
                : "mb-6 md:mb-10"

            return (
              <Link
                key={entry.id}
                href={`/lookbook?entry=${entry.id}`}
                data-strip-item
                data-index={idx}
                className={`
                  relative shrink-0 snap-center block group
                  ${widthClass} ${heightClass} ${offsetClass}
                  transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                `}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Image container with cinematic crop */}
                <div
                  className={`
                    relative w-full h-full overflow-hidden
                    transition-all duration-700 ease-out
                    ${isActive || isHovered
                      ? "opacity-100 scale-100"
                      : "opacity-30 scale-[0.97]"
                    }
                  `}
                >
                  {/* The image */}
                  <Image
                    src={entry.imageUrl}
                    alt={entry.title || `Look ${String(idx + 1).padStart(2, '0')}`}
                    fill
                    sizes="(max-width: 768px) 80vw, 620px"
                    quality={85}
                    loading={idx < 4 ? "eager" : "lazy"}
                    className={`
                      object-cover
                      transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)]
                      ${isActive || isHovered ? "scale-110" : "scale-100"}
                    `}
                  />

                  {/* Dark bottom gradient for text overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                  {/* Grain on each image */}
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-overlay z-10"
                    style={{
                      opacity: 0.04,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                      backgroundSize: "128px 128px",
                    }}
                  />

                  {/* Top-left index badge — only on active */}
                  <div
                    className={`
                      absolute top-5 left-5 z-20
                      transition-all duration-500 ease-out
                      ${isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}
                    `}
                  >
                    <span
                      className="text-[9px] font-black tracking-[0.3em] uppercase text-white/80 bg-black/50 backdrop-blur-xl px-3.5 py-2 border border-white/10"
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Bottom reveal on hover — title + explore CTA */}
                  <div
                    className={`
                      absolute bottom-0 left-0 right-0 p-6 z-20
                      transition-all duration-500 ease-out
                      ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                    `}
                  >
                    {entry.title && (
                      <p className="text-[11px] font-black tracking-[0.2em] uppercase text-white mb-2 leading-tight">
                        {entry.title}
                      </p>
                    )}
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/50 flex items-center gap-2">
                      Explore Look
                      <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </div>

                {/* Below-image index line — red for active */}
                <div className="mt-4 flex items-center gap-3">
                  <div
                    className={`
                      h-[2px] transition-all duration-700
                      ${isActive ? "w-8 bg-[var(--accent-red)]" : "w-4 bg-white/10"}
                    `}
                  />
                  <span
                    className={`
                      text-[9px] font-bold tracking-[0.25em] uppercase transition-colors duration-500
                      ${isActive ? "text-white/60" : "text-white/15"}
                    `}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          LAYER 4 — Bottom: progress + CTA
          ═══════════════════════════════════════════ */}
      <div className="relative z-10 px-8 md:px-16 lg:px-24 pt-12 pb-28 md:pb-36">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Progress indicator */}
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <div className="w-32 md:w-48 h-[2px] bg-white/5 overflow-hidden">
              <motion.div
                className="h-full bg-[var(--accent-red)]"
                animate={{ width: `${((activeIndex + 1) / total) * 100}%` }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </div>
            <span className="text-[10px] font-black tracking-[0.2em] text-white/15 uppercase">
              {String(total).padStart(2, '0')}
            </span>
          </div>

          {/* Enter Lookbook CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <Link
              href="/lookbook"
              className="group inline-flex items-center gap-4 text-[11px] font-black tracking-[0.25em] uppercase text-white/40 hover:text-white transition-colors duration-500"
            >
              <span className="relative">
                Enter the Archive
                <span className="absolute bottom-[-3px] left-0 w-0 h-[1px] bg-[var(--accent-red)] group-hover:w-full transition-all duration-500" />
              </span>
              <motion.span
                className="inline-flex items-center justify-center w-8 h-8 border border-white/10 group-hover:border-[var(--accent-red)] group-hover:bg-[var(--accent-red)]/10 transition-all duration-500"
                whileHover={{ x: 4 }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Vignette — matches Hero */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </motion.section>
  )
}
