'use client'
import { motion } from 'framer-motion'
import { useShopStore, AvailabilityOption } from '@/stores/shopStore'

const OPTIONS: { label: string; value: AvailabilityOption }[] = [
  { label: 'All',      value: 'all'      },
  { label: 'In Stock', value: 'in_stock' },
  { label: 'On Sale',  value: 'on_sale'  },
]

export function AvailabilityFilter() {
  const { availability, setAvailability } = useShopStore()

  return (
    <div className="flex items-center gap-5">
      {OPTIONS.map(o => {
        const isActive = availability === o.value
        return (
          <button
            key={o.value}
            onClick={() => setAvailability(o.value)}
            className={`
              text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 relative pb-1 group
              ${isActive ? 'text-white' : 'text-white/20 group-hover:text-white/60'}
            `}
          >
            {o.label}
            {isActive && (
              <motion.span
                layoutId="avail-underline"
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
