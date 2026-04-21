"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

interface AuthSplitLayoutProps {
  children: React.ReactNode
  quote: string
  bgImage?: string
  isAdmin?: boolean
}

export default function AuthSplitLayout({ children, quote, bgImage, isAdmin = false }: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-black text-white selection:bg-white/20 overflow-hidden relative">
      
      {/* ─── Global Noise Texture ─── */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ─── LEFT: Visual / Mood ─── */}
      <div className="relative w-full md:w-1/2 h-[35vh] md:h-screen flex flex-col justify-between p-8 md:p-16 overflow-hidden border-b md:border-b-0 md:border-r border-white/[0.05]">
        
        {/* Dynamic Background Base */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="w-full h-full object-cover scale-110 origin-center"
            animate={{ 
              scale: [1.1, 1.18, 1.1],
              x: [0, -20, 0],
              y: [0, 10, 0]
            }}
            transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
          >
            {isAdmin ? (
              <div className="w-full h-full bg-[#030303] bg-[radial-gradient(circle_at_50%_50%,#2a0000_0%,#000000_100%)]" />
            ) : (
              <div 
                className="w-full h-full bg-cover bg-center brightness-[0.4] grayscale-[0.1]"
                style={{ backgroundImage: `url('${bgImage || "https://images.unsplash.com/photo-1617325247661-3a055d73b063?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"}')` }} 
              />
            )}
          </motion.div>
          
          {/* Scanline / CRT Intensity Layer */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.01),rgba(0,0,255,0.04))] bg-[length:100%_3px,3px_100%] opacity-20" />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-20" />
        </div>

        {/* Header / Brand */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-black uppercase tracking-[-0.04em] text-white hover:text-accent-red transition-colors" data-cursor="hover">
            BAD SZN
          </Link>
          {isAdmin && (
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-accent-red animate-pulse select-none">
              Restricted
            </span>
          )}
        </div>

        {/* Quote Overlay */}
        <div className="relative z-10 max-w-lg mt-auto md:mt-0">
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`
              text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-[-0.04em] leading-[0.95]
              ${isAdmin ? "text-transparent [Webkit-text-stroke:1px_var(--accent-red)]" : "text-white"}
              [text-shadow:2px_2px_0_rgba(255,0,0,0.05),-2px_-2px_0_rgba(0,255,255,0.05)]
            `}
          >
            {quote}
          </motion.p>
          {!isAdmin && (
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-[2px] w-16 bg-accent-red mt-6 origin-left"
            />
          )}
        </div>
      </div>

      {/* ─── RIGHT: Form Canvas ─── */}
      <div className={`w-full md:w-1/2 min-h-[65vh] md:h-screen flex items-center justify-center p-8 md:p-16 relative z-10 ${isAdmin ? "bg-black" : "bg-black text-white"}`}>
        <div className="w-full max-w-sm relative">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </div>

    </div>
  )
}
