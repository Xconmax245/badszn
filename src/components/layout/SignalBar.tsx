"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { X, Megaphone } from "lucide-react"

interface SignalBarProps {
  text?: string | null
}

export default function SignalBar({ text }: SignalBarProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!text || !isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative w-full bg-accent-red text-white overflow-hidden z-[60]"
      >
        <div className="max-w-[1600px] mx-auto px-6 py-2.5 flex items-center justify-center relative">
          <div className="flex items-center gap-3">
            <Megaphone className="w-3.5 h-3.5 opacity-80" />
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-center">
              {text}
            </p>
          </div>
          
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute right-4 p-1 hover:scale-110 transition-transform"
            aria-label="Close announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subtle decorative scanline */}
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-white/20 animate-pulse" />
      </motion.div>
    </AnimatePresence>
  )
}
