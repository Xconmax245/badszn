'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Product, ShopSettings } from '@/types/shop'

interface Props {
  product:  Product
  settings: ShopSettings
  onClick:  () => void
}

export function ProductCard({ product, settings, onClick }: Props) {
  const [hovered, setHovered] = useState(false)
  const [liked, setLiked]     = useState(false)

  const primaryImage   = product.images[0]
  const secondaryImage = product.images[1]

  const totalStock   = product.variants.reduce((sum, v) => sum + v.stock, 0)
  const isSoldOut    = totalStock === 0
  const isOnSale     = !!product.compareAtPrice
  const lowestStock  = Math.min(...product.variants.map(v => v.stock).filter(s => s > 0), Infinity)
  const showLowStock = settings.showStockBadge && lowestStock <= 3 && lowestStock > 0 && !isSoldOut

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer relative flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image Container ── */}
      <div
        className="relative aspect-[3/4] overflow-hidden bg-[#111] rounded-2xl"
        onClick={onClick}
      >
        {/* Base image */}
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText ?? product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        {/* Hover image — crossfade */}
        {secondaryImage && (
          <Image
            src={secondaryImage.url}
            alt={secondaryImage.altText ?? product.name}
            fill
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-600 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        {/* Sold-out overlay */}
        {isSoldOut && settings.showSoldOutOverlay && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-2xl">
            <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest">Sold Out</span>
          </div>
        )}

        {/* Top row: Badge + Heart */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
          {/* Badges */}
          <div className="flex flex-col gap-1.5">
            {product.isNew && settings.showNewBadge && !isSoldOut && (
              <span className="bg-white/90 backdrop-blur-sm text-black text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                New
              </span>
            )}
            {isOnSale && settings.showSaleBadge && !isSoldOut && (
              <span className="bg-accent-red text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Sale
              </span>
            )}
            {showLowStock && (
              <span className="bg-amber-500/90 text-black text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {lowestStock === 1 ? 'Last one' : `${lowestStock} left`}
              </span>
            )}
          </div>

          {/* Wishlist heart */}
          <button
            onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
            className={`
              w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300
              ${liked 
                ? 'bg-accent-red text-white shadow-lg shadow-red-900/30' 
                : 'bg-white/10 backdrop-blur-md text-white/50 hover:bg-white/20 hover:text-white'}
            `}
          >
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} strokeWidth={2} />
          </button>
        </div>

        {/* Quick View on hover */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out pb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white py-2 px-5 backdrop-blur-lg bg-black/40 border border-white/10 rounded-full">
            Quick View
          </span>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="mt-4 space-y-1 px-1" onClick={onClick}>
        {/* Brand */}
        <p className="text-[11px] font-medium text-white/30 uppercase tracking-wider">Bad Szn</p>

        {/* Product Name */}
        <h3 className="font-sans text-[15px] font-bold text-white leading-snug line-clamp-2 capitalize">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-0.5">
          {isOnSale && product.compareAtPrice ? (
            <>
              <span className="font-sans text-[14px] font-bold text-white">
                ₦{Number(product.basePrice).toLocaleString('en-NG')}
              </span>
              <span className="font-sans text-[12px] text-white/25 line-through">
                ₦{Number(product.compareAtPrice).toLocaleString('en-NG')}
              </span>
            </>
          ) : (
            <span className="font-sans text-[14px] font-semibold text-white/80">
              ₦{Number(product.basePrice).toLocaleString('en-NG')}
            </span>
          )}
        </div>
      </div>

      {/* ── Buy Now Button ── */}
      {!isSoldOut && (
        <button
          onClick={onClick}
          className="mt-4 w-full py-3 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-white/90 transition-colors duration-200"
        >
          Buy Now
        </button>
      )}
    </motion.article>
  )
}
