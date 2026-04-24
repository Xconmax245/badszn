'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Minus, Plus, Share2, Shirt, User, Star, Droplets, Zap, Check } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCartStore } from '@/stores/cartStore'
import { trackEvent } from '@/lib/events'
import { ProductModalToast } from './ProductModalToast'
import type { Product, ShopSettings } from '@/types/shop'

const ACCORDIONS = [
  { key: 'material',   label: 'Material',   icon: Shirt },
  { key: 'fit',        label: 'Fit',        icon: User },
  { key: 'design',     label: 'Design',     icon: Star },
  { key: 'care',       label: 'Care',       icon: Droplets },
  { key: 'uniqueness', label: 'Uniqueness', icon: Zap },
]

interface Props {
  product:  Product
  settings: ShopSettings
  onClose:  () => void
}

export function ProductModalDetails({ product, settings, onClose }: Props) {
  const [selectedSize,  setSelectedSize]  = useState<string | null>(null)
  const [quantity,      setQuantity]      = useState(1)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const [toastVisible,  setToastVisible]  = useState(false)
  const [adding,        setAdding]        = useState(false)
  const { addItem, openCart } = useCartStore()

  const availableSizes = Array.from(new Set(product.variants.map(v => v.size)))
  const getVariant     = (size: string) => product.variants.find(v => v.size === size)
  const isInStock      = (size: string) => (getVariant(size)?.stock ?? 0) > 0
  const selectedVar    = selectedSize ? getVariant(selectedSize) : null
  const selectedStock  = selectedVar?.stock ?? 0
  const canAdd         = !!selectedSize && isInStock(selectedSize)
  const isOnSale       = !!product.compareAtPrice
  const isSoldOut      = product.variants.every(v => v.stock === 0)

  useEffect(() => { setQuantity(1) }, [selectedSize])

  const handleAddToBag = () => {
    if (!canAdd || !selectedVar || adding) return
    setAdding(true)
    trackEvent('ADD_TO_CART', { productId: product.id, size: selectedSize })
    setTimeout(async () => {
      addItem({
        product,
        variant: selectedVar,
        price: Number(product.basePrice),
        quantity,
      })

      // Sync to DB for logged-in users
      await fetch("/api/cart", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          productId: product.id,
          variantId: selectedVar.id,
          quantity:  quantity,
        }),
      }).catch(() => {
        // Guest — Zustand already updated, localStorage handles persistence
      })

      setAdding(false)
      setToastVisible(true)
      // open the cart drawer
      openCart()
    }, 300)
  }

  const handleBuyNow = () => {
    if (!canAdd || !selectedVar) return
    addItem({
      product,
      variant: selectedVar,
      price: Number(product.basePrice),
      quantity,
    })
    window.location.href = '/checkout'
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/shop/${product.slug}`
    try {
      if (navigator.share) await navigator.share({ title: product.name, url })
      else {
        await navigator.clipboard.writeText(url)
        alert('Link copied!')
      }
    } catch { /* cancelled */ }
  }

  return (
    <div className="relative h-full overflow-y-auto bg-transparent text-white no-scrollbar flex flex-col">
      <div className="p-8 md:p-10 space-y-8 flex-1">
        
        {/* ── Breadcrumb ── */}
        <p className="text-[10px] font-semibold text-white/25 uppercase tracking-[0.2em]">
          BAD SZN &nbsp;/&nbsp; {product.category?.name ?? 'Shop'}
        </p>

        {/* ── Name ── */}
        <h2 className="font-display font-black leading-[1.05] text-[clamp(1.75rem,3.5vw,2.8rem)] tracking-tight">
          {product.name}
        </h2>

        {/* ── Price ── */}
        <div className="flex items-baseline gap-3">
          <span className="font-sans text-lg font-bold tracking-tight">
            ₦{Number(product.basePrice).toLocaleString('en-NG', { minimumFractionDigits: 2 })} <span className="text-[10px] font-semibold text-white/30 ml-0.5">NGN</span>
          </span>
          {isOnSale && product.compareAtPrice && (
            <span className="font-sans text-sm text-white/25 line-through">
              ₦{Number(product.compareAtPrice).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>

        {/* ── Size Selector ── */}
        {!isSoldOut && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Select Size</p>
              {selectedSize && (
                <motion.span 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[10px] font-bold text-accent-red uppercase tracking-widest"
                >
                  {selectedSize} Selected
                </motion.span>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map(size => {
                const oos      = !isInStock(size)
                const selected = selectedSize === size
                return (
                  <button
                    key={size}
                    onClick={() => !oos && setSelectedSize(size)}
                    disabled={oos}
                    className={`
                      relative min-w-[64px] h-12 rounded-xl text-[12px] font-black uppercase transition-all duration-300
                      ${selected
                        ? 'bg-white text-black scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                        : oos
                          ? 'bg-white/[0.02] border border-white/5 text-white/10 cursor-not-allowed'
                          : 'bg-white/[0.05] border border-white/10 text-white/60 hover:border-white/40 hover:bg-white/[0.08]'}
                    `}
                  >
                    {size}
                    {oos && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-[1px] bg-white/10 rotate-45" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            
            {/* Stock Feedback - More Prominent */}
            <AnimatePresence mode="wait">
              {selectedSize && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-2"
                >
                  {!isInStock(selectedSize) ? (
                    <div className="flex items-center gap-2 text-red-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Sold out in this size</p>
                    </div>
                  ) : selectedStock <= 3 ? (
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping absolute inset-0" />
                        <div className="w-2 h-2 rounded-full bg-amber-500 relative" />
                      </div>
                      <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">
                        Hurry! Only {selectedStock} left in {selectedSize}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-500/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Ready to ship in {selectedSize}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ── Quantity ── */}
        {!isSoldOut && (
          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Quantity</p>
            <div className="inline-flex items-center border border-white/10 rounded-full overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 h-10 flex items-center justify-center text-[13px] font-bold border-x border-white/10">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => Math.min(selectedStock || 10, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── CTAs ── */}
        <div className="space-y-3 pt-2">
          {isSoldOut ? (
            <button disabled className="w-full py-4 font-bold text-[11px] uppercase tracking-[0.2em] border border-white/10 text-white/20 cursor-not-allowed rounded-full">
              Sold Out
            </button>
          ) : (
            <>
              <button
                onClick={handleAddToBag}
                disabled={!canAdd || adding}
                className={`
                  w-full py-4 font-bold text-[11px] uppercase tracking-[0.2em] border rounded-full transition-all duration-300
                  ${!canAdd
                    ? 'border-white/10 text-white/20 cursor-not-allowed'
                    : adding
                      ? 'border-green-500 text-green-400 bg-green-500/5'
                      : 'border-white/20 text-white hover:bg-white hover:text-black'}
                `}
              >
                {adding ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check size={14} /> Adding...
                  </span>
                ) : !selectedSize ? 'Select a size' : 'Add to cart'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!canAdd}
                className={`
                  w-full py-4 font-bold text-[11px] uppercase tracking-[0.2em] rounded-full transition-all duration-300
                  ${!canAdd
                    ? 'bg-white/5 text-white/15 cursor-not-allowed'
                    : 'bg-accent-red text-white hover:brightness-110'}
                `}
              >
                Buy it now
              </button>
            </>
          )}
        </div>

        {/* ── Description ── */}
        <div className="pt-6 border-t border-white/[0.06]">
          <p className="text-[13px] leading-[1.85] text-white/45">
            {product.description}
          </p>
        </div>

        {/* ── Accordions ── */}
        <div className="divide-y divide-white/[0.06] border-t border-b border-white/[0.06]">
          {ACCORDIONS.map((acc) => {
            const content = product.details?.[acc.key as keyof typeof product.details]
            const isOpen  = openAccordion === acc.key
            const Icon    = acc.icon
            return (
              <div key={acc.key}>
                <button
                  onClick={() => setOpenAccordion(isOpen ? null : acc.key)}
                  className="w-full flex items-center justify-between py-4 text-white/50 hover:text-white/80 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={15} strokeWidth={1.5} className="opacity-40" />
                    <span className="text-[12px] font-semibold capitalize tracking-wide">
                      {acc.label}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-300 opacity-25 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pl-8 text-[12px] leading-relaxed text-white/35">
                        {content ?? 'No information available.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* ── Share ── */}
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2.5 px-6 py-2.5 border border-white/10 text-white/40 hover:text-white hover:border-white/30 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all"
        >
          <Share2 size={12} />
          Share
        </button>

      </div>

      <ProductModalToast
        visible={toastVisible}
        message="Added to Bag"
        onDismiss={() => setToastVisible(false)}
      />
    </div>
  )
}
