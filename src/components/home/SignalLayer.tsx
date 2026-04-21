"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import type { Signal } from "./SignalLayerServer"
import SectionDivider from "@/components/shared/SectionDivider"

export default function SignalLayer({ initialSignals }: { initialSignals: Signal[] }) {
  const [activeSignals, setActiveSignals] = useState<Signal[]>(initialSignals.slice(0, 4))
  const [queue, setQueue] = useState<Signal[]>(initialSignals.slice(4))

  useEffect(() => {
    if (initialSignals.length <= 4) return

    const interval = setInterval(() => {
      setActiveSignals(prevActive => {
        const nextQueue = [...queue]
        const incoming = nextQueue.shift()
        
        if (!incoming) {
          setQueue(initialSignals.filter(s => !prevActive.find(a => a.id === s.id)))
          return prevActive
        }

        const outgoing = prevActive[prevActive.length - 1]
        nextQueue.push(outgoing)
        setQueue(nextQueue)

        return [incoming, ...prevActive.slice(0, 3)]
      })
    }, 4500)

    return () => clearInterval(interval)
  }, [queue, initialSignals])

  if (!initialSignals || initialSignals.length === 0) return null

  // We assign subtle intensity classes based on position to create a heat-map feel
  const getOpacityClass = (index: number) => {
    switch (index) {
      case 0: return "opacity-100"
      case 1: return "opacity-80"
      case 2: return "opacity-50"
      case 3: return "opacity-30"
      default: return "opacity-20"
    }
  }

  return (
    <section className="relative w-full bg-[#030303] py-20 overflow-hidden border-y border-white/[0.03]">
      
      {/* ─── Premium Grain Engine ─── */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none mix-blend-overlay"
        style={{
          opacity: 0.15,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 mx-auto px-6 md:px-12 lg:px-24 max-w-[1800px] flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-24">
        
        {/* ─── Telemetry Header ─── */}
        <div className="shrink-0 flex items-center lg:flex-col lg:items-start gap-6 lg:gap-4 lg:border-r border-white/5 lg:pr-24 py-4">
          <div className="relative flex h-2.5 w-2.5 lg:mb-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-red)] opacity-60"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--accent-red)]"></span>
          </div>
          <div>
            <h2 className="text-[9px] md:text-[10px] font-black tracking-[0.4em] uppercase text-white/40 leading-tight">
              Network
            </h2>
            <h3 className="text-[11px] md:text-[12px] font-bold tracking-[0.2em] text-white mt-1 uppercase">
              Live Feed
            </h3>
          </div>
        </div>

        {/* ─── Signal Stream ─── */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          <AnimatePresence mode="popLayout">
            {activeSignals.map((signal, idx) => (
              <motion.div
                key={signal.id}
                layout
                initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex flex-col gap-3 group transition-opacity duration-1000 ${getOpacityClass(idx)}`}
              >
                {/* Micro-Header */}
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                  <span className="text-[8px] font-black tracking-[0.3em] uppercase text-[var(--accent-red)]">
                    {signal.type}
                  </span>
                  <span className="text-[8px] tracking-[0.2em] uppercase text-white/30 font-medium">
                    {formatDistanceToNow(new Date(signal.createdAt), { addSuffix: true }).replace('about ', '')}
                  </span>
                </div>
                
                {/* The Reading */}
                <p className="text-[11px] md:text-[12px] font-medium tracking-[0.05em] text-white/80 leading-relaxed pr-4">
                  {signal.message}
                </p>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -inset-x-4 -inset-y-4 rounded-xl" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
