'use client'

import { useShopStore } from '@/stores/shopStore'
import { motion } from 'framer-motion'
import { Database, RotateCcw } from 'lucide-react'

export function ShopEmptyState() {
  const { resetFilters } = useShopStore()
  
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
        <span className="text-[25vw] font-black uppercase tracking-tighter leading-none select-none">
          EMPTY
        </span>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 space-y-12"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 border border-white/5 flex items-center justify-center bg-white/[0.02]">
            <Database size={24} className="text-white/10" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white/80">
            Zero_Results_Found
          </h2>
          <div className="max-w-xs mx-auto">
            <p className="text-[10px] md:text-[11px] font-bold text-white/20 uppercase tracking-[0.3em] leading-loose">
              No telemetry matches your current archive selection. Adjust your parameters or refresh the stream.
            </p>
          </div>
        </div>

        <div className="pt-6">
          <button
            onClick={resetFilters}
            className="group flex items-center gap-4 mx-auto px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 hover:bg-black hover:text-white border border-white"
          >
            <RotateCcw size={12} className="transition-transform duration-500 group-hover:-rotate-180" />
            <span>Reset_Telemetry</span>
          </button>
        </div>
      </motion.div>

      {/* Decorative lines */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-t from-white/10 to-transparent" />
    </div>
  )
}
