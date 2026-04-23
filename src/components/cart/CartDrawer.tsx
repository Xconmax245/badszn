'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import CartUpsell from './CartUpsell'
import { useEffect } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

export default function CartDrawer() {
  const {
    isOpen, closeCart,
    items, updateQty, removeItem,
    subtotal, itemCount,
  } = useCartStore()

  const sub   = subtotal()
  const count = itemCount()

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed top-0 right-0 z-[80] w-full max-w-md h-full bg-[#0A0A0A] border-l border-white/[0.06] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <ShoppingBag size={16} className="text-white/50" />
                <h2 className="text-sm font-black uppercase tracking-widest text-white">
                  Cart
                </h2>
                {count > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-black text-white">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close cart"
              >
                <X size={16} />
              </button>
            </div>

            {/* Items */}
            <div 
              className="flex-1 overflow-y-auto px-6 no-scrollbar"
              data-lenis-prevent
            >
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={32} className="text-white/10" />
                  <p className="text-white/30 text-sm">Your cart is empty</p>
                  <button
                    onClick={closeCart}
                    className="text-[10px] tracking-widest uppercase text-white/20 hover:text-white transition-colors"
                  >
                    Continue Shopping →
                  </button>
                </div>
              ) : (
                <div className="py-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.variantId}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="flex gap-3 py-4 border-b border-white/[0.06]"
                      >
                        {/* Image */}
                        <div className="relative w-16 h-20 bg-zinc-900 flex-shrink-0 rounded-lg overflow-hidden">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-xs font-bold uppercase tracking-wide text-white truncate">
                                {item.name}
                              </p>
                              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">
                                {item.size}{item.color ? ` · ${item.color}` : ''}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-white whitespace-nowrap">
                              ₦{(item.price * item.quantity).toLocaleString('en-NG')}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 border border-white/[0.1] rounded-full px-2.5 py-1">
                              <button
                                onClick={async () => {
                                  const newQty = item.quantity - 1;
                                  updateQty(item.variantId, newQty);
                                  if (item.id) {
                                    await fetch(`/api/cart/${item.id}`, {
                                      method: 'PATCH',
                                      body: JSON.stringify({ quantity: newQty })
                                    }).catch(() => {});
                                  }
                                }}
                                className="text-white/50 hover:text-white transition-colors text-xs"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-xs font-bold text-white tabular-nums w-3 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={async () => {
                                  const newQty = item.quantity + 1;
                                  updateQty(item.variantId, newQty);
                                  if (item.id) {
                                    await fetch(`/api/cart/${item.id}`, {
                                      method: 'PATCH',
                                      body: JSON.stringify({ quantity: newQty })
                                    }).catch(() => {});
                                  }
                                }}
                                className="text-white/50 hover:text-white transition-colors text-xs"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <button
                              onClick={async () => {
                                removeItem(item.variantId);
                                if (item.id) {
                                  await fetch(`/api/cart/${item.id}`, { method: 'DELETE' }).catch(() => {});
                                }
                              }}
                              className="text-[9px] tracking-widest uppercase text-white/20 hover:text-red-400 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <CartUpsell />
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/[0.06] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Subtotal</span>
                  <span className="text-sm font-black text-white">
                    ₦{sub.toLocaleString('en-NG')}
                  </span>
                </div>
                <p className="text-[10px] text-white/25 tracking-wide">
                  Shipping & taxes calculated at checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center py-4 rounded-full bg-white text-black text-[11px] font-black tracking-[0.2em] uppercase hover:bg-white/90 transition-all active:scale-[0.98]"
                >
                  Checkout →
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="text-center text-[10px] tracking-widest uppercase text-white/30 hover:text-white/60 transition-colors"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
