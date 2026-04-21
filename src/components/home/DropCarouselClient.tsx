"use client"

import {
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react"
import { motion, useInView } from "framer-motion"
import DropCarouselItem from "./DropCarouselItem"
import type { CarouselCollection } from "@/lib/supabase/queries/collections"

const EASE = [0.22, 1, 0.36, 1] as const

export default function DropCarouselClient({
  collections,
}: {
  collections: CarouselCollection[]
}) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const sectionRef    = useRef<HTMLDivElement>(null)
  const isInView      = useInView(sectionRef, { once: true, margin: "-10%" })
  const [activeIndex, setActiveIndex] = useState(0)
  const isScrolling   = useRef(false)

  // ── Scroll to item by index ─────────────────
  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current
    if (!container) return

    const items = container.querySelectorAll<HTMLElement>("[data-carousel-item]")
    const item  = items[index]
    if (!item) return

    const containerCenter = container.offsetWidth / 2
    const itemCenter      = item.offsetLeft + item.offsetWidth / 2
    container.scrollTo({
      left:     itemCenter - containerCenter,
      behavior: "smooth",
    })
  }, [])

  // ── Detect active item on scroll end ────────
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let timeout: ReturnType<typeof setTimeout>

    const onScroll = () => {
      clearTimeout(timeout)
      isScrolling.current = true

      timeout = setTimeout(() => {
        isScrolling.current = false

        const items = container.querySelectorAll<HTMLElement>("[data-carousel-item]")
        const containerCenter = container.scrollLeft + container.offsetWidth / 2

        let closest      = 0
        let closestDist  = Infinity

        items.forEach((item, i) => {
          const itemCenter = item.offsetLeft + item.offsetWidth / 2
          const dist       = Math.abs(itemCenter - containerCenter)
          if (dist < closestDist) {
            closestDist = dist
            closest     = i
          }
        })

        setActiveIndex(closest)
      }, 100)
    }

    container.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      container.removeEventListener("scroll", onScroll)
      clearTimeout(timeout)
    }
  }, [])

  // ── Arrow navigation ─────────────────────────
  const goNext = () => {
    const next = Math.min(activeIndex + 1, collections.length - 1)
    setActiveIndex(next)
    scrollToIndex(next)
  }

  const goPrev = () => {
    const prev = Math.max(activeIndex - 1, 0)
    setActiveIndex(prev)
    scrollToIndex(prev)
  }

  // ── Keyboard navigation ──────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft")  goPrev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [activeIndex])

  // ── Initial scroll positioning ───────────────
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => scrollToIndex(0), 400)
      return () => clearTimeout(timer)
    }
  }, [isInView, scrollToIndex])

  return (
    <div ref={sectionRef} className="relative">
      {/* Carousel scroll container */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: EASE }}
        className="
          flex gap-8 md:gap-12
          overflow-x-scroll
          scroll-smooth
          pb-6
          cursor-grab active:cursor-grabbing
          no-scrollbar
        "
        style={{
          scrollSnapType:          "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Left spacer — centers first item */}
        <div
          className="flex-shrink-0"
          style={{ width: "calc(50vw - 42.5vw)" }}
          aria-hidden="true"
        />

        {collections.map((collection, i) => (
          <DropCarouselItem
            key={collection.id}
            collection={collection}
            isActive={activeIndex === i}
            index={i}
            onClick={() => {
              setActiveIndex(i)
              scrollToIndex(i)
            }}
          />
        ))}

        {/* Right spacer — centers last item */}
        <div
          className="flex-shrink-0"
          style={{ width: "calc(50vw - 42.5vw)" }}
          aria-hidden="true"
        />
      </motion.div>

      {/* Minimal Controls */}
      <div className="flex items-center justify-between px-6 md:px-12 lg:px-20 mt-8 md:mt-12">
        
        {/* Progress indicator */}
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-medium tracking-[0.2em] text-white/20 tabular-nums">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-2">
            {collections.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActiveIndex(i); scrollToIndex(i) }}
                className={`
                  h-[2px] transition-all duration-700 rounded-full
                  ${activeIndex === i
                    ? "w-10 bg-white"
                    : "w-4 bg-white/10 hover:bg-white/25"
                  }
                `}
                aria-label={`View drop ${i + 1}`}
              />
            ))}
          </div>
          <span className="text-[11px] font-medium tracking-[0.2em] text-white/10 tabular-nums">
            {String(collections.length).padStart(2, "0")}
          </span>
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center gap-3">
          <button
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="
              w-11 h-11
              border border-white/[0.08]
              flex items-center justify-center
              text-white/30 hover:text-white hover:border-white/25
              disabled:opacity-[0.08] disabled:cursor-not-allowed
              transition-all duration-500
              group
            "
          >
            <span className="text-sm group-hover:-translate-x-0.5 transition-transform duration-300">←</span>
          </button>
          <button
            onClick={goNext}
            disabled={activeIndex === collections.length - 1}
            className="
              w-11 h-11
              border border-white/[0.08]
              flex items-center justify-center
              text-white/30 hover:text-white hover:border-white/25
              disabled:opacity-[0.08] disabled:cursor-not-allowed
              transition-all duration-500
              group
            "
          >
            <span className="text-sm group-hover:translate-x-0.5 transition-transform duration-300">→</span>
          </button>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
