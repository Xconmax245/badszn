'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { useShopStore } from '@/stores/shopStore'
import Navbar from '@/components/layout/Navbar'
import { FilterBar } from './FilterBar'
import { ProductGrid } from './ProductGrid'
import { ShopAnnouncement } from './ShopAnnouncement'
import { Pagination } from './Pagination'
import { ProductModal } from './ProductModal'
import { ShopEmptyState } from './ShopEmptyState'
import { AnimatePresence } from 'framer-motion'
import type { Product, ShopSettings } from '@/types/shop'

const fetcher = (url: string) => fetch(url).then(r => r.json())

function buildQueryString(store: any) {
  const params = new URLSearchParams()
  if (store.category)              params.set('category', store.category)
  if (store.sizes.length)          params.set('sizes', store.sizes.join(','))
  if (store.sort !== 'newest')     params.set('sort', store.sort)
  if (store.availability !== 'all') params.set('availability', store.availability)
  if (store.search)                params.set('search', store.search)
  params.set('page', String(store.page))
  params.set('limit', '12')
  return params.toString()
}

interface Props {
  initialProducts: Product[]
  initialTotal:    number
  settings:        ShopSettings
}

export function ShopPage({ initialProducts, initialTotal, settings }: Props) {
  const store = useShopStore()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const qs = buildQueryString(store)

  const { data, isLoading } = useSWR(
    `/api/shop/products?${qs}`,
    fetcher,
    { 
      fallbackData: { products: initialProducts, total: initialTotal },
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  )

  const products: Product[] = data?.products ?? []
  const total: number       = data?.total ?? 0
  const totalPages          = Math.ceil(total / 12)

  // Handle modal close
  const handleCloseModal = () => setSelectedProduct(null)

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar announcement={settings.announcementText} />

      {/* Spacing for fixed navbar */}
      <div className="pt-24 md:pt-32">
        {settings.enableFilters && (
          <FilterBar settings={settings} />
        )}

        {products.length === 0 && !isLoading ? (
          <ShopEmptyState />
        ) : (
          <ProductGrid
            products={products}
            isLoading={isLoading}
            settings={settings}
            onProductClick={(p) => setSelectedProduct(p)}
          />
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={store.page}
            totalPages={totalPages}
            onPageChange={store.setPage}
          />
        )}
      </div>

      <AnimatePresence mode="wait">
        {selectedProduct && (
          <ProductModal
            key={selectedProduct.id}
            product={selectedProduct}
            settings={settings}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
