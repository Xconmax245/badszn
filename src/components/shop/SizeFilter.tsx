'use client'
import { motion } from 'framer-motion'
import { useShopStore } from '@/stores/shopStore'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL']

export function SizeFilter() {
  const { sizes, toggleSize } = useShopStore()

  return (
    <div className="flex items-center gap-4">
      {SIZES.map(s => {
        const active = sizes.includes(s)
        return (
          <button
            key={s}
            onClick={() => toggleSize(s)}
            className={`
              text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 relative pb-1 group
              ${active ? 'text-white' : 'text-white/20 group-hover:text-white/60'}
            `}
          >
            {s}
            {active && (
              <motion.span
                layoutId="size-underline"
                className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-accent-red"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
