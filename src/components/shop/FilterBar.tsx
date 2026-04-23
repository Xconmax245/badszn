'use client'

import { useState } from 'react'
import { useShopStore } from '@/stores/shopStore'
import { CategoryTabs } from './CategoryTabs'
import { SizeFilter } from './SizeFilter'
import { SortDropdown } from './SortDropdown'
import { AvailabilityFilter } from './AvailabilityFilter'
import { SearchBar } from './SearchBar'
import { AnimatePresence, motion } from 'framer-motion'
import type { ShopSettings } from '@/types/shop'

export function FilterBar({ settings }: { settings: ShopSettings }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <div className="sticky top-[88px] md:top-[100px] z-40 px-4 pt-4 mb-10 flex justify-center">
        <div className={`
          inline-flex items-center gap-10 px-8 py-3 
          bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] 
          rounded-full shadow-cinematic 
          overflow-x-auto no-scrollbar
        `}>
          <div className="flex items-center gap-10 flex-shrink-0">
            {/* 01_CATEGORIES */}
            <CategoryTabs />

            {/* 02_SIZES */}
            <SizeFilter />

            {/* 03_AVAILABILITY */}
            <AvailabilityFilter />
          </div>

          <div className="w-px h-4 bg-white/10 hidden md:block" />

          <div className="flex items-center gap-8 flex-shrink-0">
            {/* 04_SEARCH */}
            {settings.enableSearch && <SearchBar />}

            {/* 05_SORT */}
            <SortDropdown />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <MobileFilterDrawer onClose={() => setMobileOpen(false)} settings={settings} />
        )}
      </AnimatePresence>
    </>
  )
}

function MobileFilterDrawer({
  onClose,
  settings,
}: {
  onClose: () => void
  settings: ShopSettings
}) {
  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50
                   bg-bg-primary border-t border-white/10 rounded-t-[32px] p-8 space-y-8"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-white/50">Filters</h3>
          <button onClick={onClose} className="text-[10px] uppercase font-bold text-white/20">Close</button>
        </div>
        
        <div className="space-y-10">
          <CategoryTabs />
          <div className="h-px bg-white/5" />
          <SizeFilter />
          <div className="h-px bg-white/5" />
          <AvailabilityFilter />
          <div className="h-px bg-white/5" />
          <SortDropdown />
        </div>

        <button
          onClick={onClose}
          className="w-full bg-white text-black font-black text-[11px] tracking-[0.2em] uppercase py-5 rounded-full mt-8"
        >
          Confirm Settings
        </button>
      </motion.div>
    </>
  )
}
