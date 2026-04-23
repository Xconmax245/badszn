'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { ProductModalGallery } from './ProductModalGallery'
import { ProductModalDetails } from './ProductModalDetails'
import type { Product, ShopSettings } from '@/types/shop'

interface Props {
  product: Product
  settings: ShopSettings
  onClose: () => void
}

export function ProductModal({ product, settings, onClose }: Props) {
  // Scroll lock + ESC key
  useEffect(() => {
    const lenis = (window as any).__lenis
    if (lenis) lenis.stop()
    else document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)

    return () => {
      if (lenis) lenis.start()
      else document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center pointer-events-none p-0 md:p-8">
        <motion.div
          className="
            pointer-events-auto relative
            w-full md:max-w-[1100px]
            h-[95vh] md:h-[88vh]
            flex flex-col md:flex-row
            overflow-hidden
            bg-[#0D0D0D]
            rounded-t-3xl md:rounded-3xl
            border border-white/[0.08]
            shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]
          "
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-[70] w-10 h-10 rounded-full bg-white/[0.06] backdrop-blur-md flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={18} strokeWidth={1.5} />
          </button>

          {/* Left: Stacked Gallery */}
          <div className="w-full md:w-[55%] shrink-0 h-[45vh] md:h-full overflow-y-auto no-scrollbar">
            <ProductModalGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Right: Details */}
          <div className="flex-1 overflow-y-auto no-scrollbar h-full border-t md:border-t-0 md:border-l border-white/[0.06]">
            <ProductModalDetails
              product={product}
              settings={settings}
              onClose={onClose}
            />
          </div>
        </motion.div>
      </div>
    </>
  )
}
