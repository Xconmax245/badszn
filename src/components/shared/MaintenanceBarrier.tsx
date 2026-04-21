"use client"

import { motion } from "framer-motion"
import { AlertCircle, Zap } from "lucide-react"

export default function MaintenanceBarrier() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex flex-col items-center justify-center p-10 overflow-hidden">
      {/* Background Atmosphere */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-12 max-w-2xl">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="w-24 h-24 rounded-full border border-accent-red/30 flex items-center justify-center relative bg-accent-red/5"
        >
          <div className="absolute inset-0 rounded-full border border-accent-red animate-ping opacity-20" />
          <AlertCircle className="w-10 h-10 text-accent-red" />
        </motion.div>

        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-hud tracking-tighter text-white uppercase italic">
            System_Offline
          </h1>
          <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.4em] text-white/20 px-8 leading-relaxed">
            Storefront protocols are currently suspended for atmospheric reconfiguration. Stand by for signal restoration.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
           <div className="h-20 w-[1px] bg-gradient-to-b from-accent-red to-transparent" />
           <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-accent-red animate-pulse" />
              <span className="text-[10px] font-hud text-white tracking-[0.2em] opacity-40">Frequency_Bad_Szn</span>
           </div>
        </div>
      </div>

      {/* Decorative scanning line */}
      <div className="absolute inset-x-0 top-0 h-[100vh] w-full pointer-events-none opacity-[0.02]">
         <div className="w-full h-full scanline-effect" />
      </div>
    </div>
  )
}
