'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'

export default function CartEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center px-6"
    >
      <ShoppingBag size={48} strokeWidth={1} className="text-white/10" />
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
          Nothing here yet
        </h2>
        <p className="text-white/40 text-sm max-w-xs mx-auto">
          Looks like you haven&apos;t added anything. The drop won&apos;t wait.
        </p>
      </div>
      <Link
        href="/shop"
        className="px-8 py-4 rounded-full bg-white text-black text-[11px] font-black tracking-[0.2em] uppercase hover:bg-red-600 hover:text-white transition-all duration-300"
      >
        Shop the Drop →
      </Link>
    </motion.div>
  )
}
