'use client'

import { AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/stores/cartStore'
import Navbar from '@/components/layout/Navbar'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import CartEmpty from './CartEmpty'
import CartUpsell from './CartUpsell'

export default function CartPageClient() {
  const { items, clearCart } = useCartStore()

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      <div className="pt-28 pb-24">
        {items.length === 0 ? (
          <CartEmpty />
        ) : (
          <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16">
            <div className="mb-10 md:mb-14">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-accent-red block mb-3">Review</span>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">Your Cart</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
                  <span className="text-[10px] tracking-widest uppercase text-white/40">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                  <button onClick={clearCart} className="text-[10px] tracking-widest uppercase text-white/20 hover:text-red-400 transition-colors">
                    Clear All
                  </button>
                </div>
                <AnimatePresence>
                  {items.map((item) => (
                    <CartItem key={item.variantId} item={item} />
                  ))}
                </AnimatePresence>
                <div className="mt-6">
                  <CartUpsell />
                </div>
              </div>
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
