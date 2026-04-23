'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import type { CartItem as CartItemType } from '@/stores/cartStore'

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQty, removeItem } = useCartStore()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-5 py-6 border-b border-white/[0.06]"
    >
      <Link href={`/shop`} className="flex-shrink-0">
        <div className="relative w-24 h-32 md:w-28 md:h-36 bg-zinc-900 overflow-hidden rounded-xl">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />
          ) : (
            <div className="w-full h-full bg-zinc-800" />
          )}
        </div>
      </Link>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-[10px] text-white/30 uppercase tracking-widest">Bad Szn</p>
            <Link href={`/shop`} className="text-sm font-bold text-white hover:text-white/70 transition-colors capitalize truncate">
              {item.name}
            </Link>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">
              Size: {item.size}{item.color ? ` · ${item.color}` : ''}
            </p>
          </div>
          <span className="text-sm font-bold text-white whitespace-nowrap">
            ₦{(item.price * item.quantity).toLocaleString('en-NG')}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="inline-flex items-center border border-white/[0.1] rounded-full overflow-hidden">
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
              className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Minus size={13} />
            </button>
            <span className="w-9 h-9 flex items-center justify-center text-[13px] font-bold text-white tabular-nums border-x border-white/[0.1]">
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
              className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Plus size={13} />
            </button>
          </div>

          <button
            onClick={async () => {
              removeItem(item.variantId);
              if (item.id) {
                await fetch(`/api/cart/${item.id}`, { method: 'DELETE' }).catch(() => {});
              }
            }}
            className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-white/20 hover:text-red-400 transition-colors"
          >
            <Trash2 size={12} />
            Remove
          </button>
        </div>
      </div>
    </motion.div>
  )
}
