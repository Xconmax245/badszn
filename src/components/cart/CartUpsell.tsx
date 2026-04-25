"use client"

import { useCartStore } from "@/stores/cartStore"
import Image from "next/image"
import { useCart } from "@/hooks/useCart"
import { useEffect, useState } from "react"

interface UpsellProduct {
  id: string
  name: string
  slug: string
  basePrice: number
  compareAtPrice: number | null
  images: { url: string }[]
  variants: { id: string; size: string; color?: string | null; stock: number }[]
  shippingCost: number // ✅ NEW
}

export default function CartUpsell() {
  const { addItem } = useCartStore()
  const { items } = useCart()
  const [upsells, setUpsells] = useState<UpsellProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUpsells = async () => {
      try {
        // Fetch products that are in stock
        const res = await fetch('/api/shop/products?limit=6&availability=in_stock')
        const data = await res.json()
        if (data.products) {
          setUpsells(data.products)
        }
      } catch (err) {
        console.error("Failed to fetch upsells:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUpsells()
  }, [])

  // Filter out products already in cart by checking productId
  const filteredUpsells = upsells
    .filter(u => !items.some(i => i.productId === u.id))
    .slice(0, 3) // Show top 3 candidates

  if (loading) {
    return (
      <div className="mt-8 pt-8 border-t border-white/[0.06] animate-pulse">
        <div className="h-2 w-24 bg-white/10 rounded mb-5" />
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center gap-4 bg-white/[0.02] rounded-xl p-3 h-20" />
          ))}
        </div>
      </div>
    )
  }

  if (filteredUpsells.length === 0) return null

  return (
    <div className="mt-8 pt-8 border-t border-white/[0.06]">
      <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-white/30 mb-5">
        Complete the look
      </h3>
      <div className="flex flex-col gap-4">
        {filteredUpsells.map((product) => {
          // Auto-select the first in-stock variant
          const firstInStockVariant = product.variants.find(v => v.stock > 0)
          if (!firstInStockVariant) return null

          const price = product.basePrice

          return (
            <div key={product.id} className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 group">
              <div className="relative w-12 h-16 bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0">
                <Image 
                  src={product.images[0]?.url || ""} 
                  alt={product.name} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-white truncate uppercase tracking-tight">{product.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[10px] text-white/40">₦{price.toLocaleString("en-NG")}</p>
                  <span className="text-[8px] text-white/20 uppercase tracking-tighter bg-white/5 px-1.5 py-0.5 rounded">
                    {firstInStockVariant.size}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => addItem({
                  product: { 
                    id: product.id, 
                    name: product.name, 
                    slug: product.slug, 
                    images: product.images,
                    shippingCost: product.shippingCost // ✅ NEW
                  },
                  variant: { 
                    id: firstInStockVariant.id, 
                    size: firstInStockVariant.size, 
                    color: firstInStockVariant.color, 
                    stock: firstInStockVariant.stock 
                  },
                  price: price,
                  quantity: 1,
                  shippingCost: product.shippingCost // ✅ NEW
                })}
                className="px-4 py-2 rounded-full border border-white/10 text-[10px] font-black tracking-widest uppercase hover:bg-white hover:text-black hover:border-white transition-all active:scale-[0.95]"
              >
                Add
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
