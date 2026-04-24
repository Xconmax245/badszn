'use client'

import { motion } from 'framer-motion'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'
import type { Product, ShopSettings } from '@/types/shop'

interface Props {
  products:       Product[]
  isLoading:      boolean
  settings:       ShopSettings
  onProductClick: (p: Product) => void
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export function ProductGrid({ products, isLoading, settings, onProductClick }: Props) {
  if (isLoading) {
    return (
      <div className="px-6 md:px-16 py-12
                      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                      gap-x-5 gap-y-16">
        {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <motion.div
      className="px-6 md:px-16 py-12
                 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                 gap-x-5 gap-y-16"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {products.map(product => (
        <motion.div key={product.id} variants={item}>
          <ProductCard
            product={product}
            settings={settings}
            onClick={() => onProductClick(product)}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
