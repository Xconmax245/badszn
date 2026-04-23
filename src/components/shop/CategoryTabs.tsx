'use client'
import { useShopStore } from '@/stores/shopStore'
import { motion } from 'framer-motion'

const CATEGORIES = [
  { label: 'All',       slug: null        },
  { label: 'Tops',      slug: 'tops'      },
  { label: 'Bottoms',   slug: 'bottoms'   },
  { label: 'Outerwear', slug: 'outerwear' },
]

export function CategoryTabs() {
  const { category, setCategory } = useShopStore()

  return (
    <nav className="flex items-center gap-4">
      {CATEGORIES.map(c => {
        const isActive = category === c.slug
        return (
          <button
            key={c.label}
            onClick={() => setCategory(c.slug)}
            className="relative pb-1 group"
          >
            <span className={`
               text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300
               ${isActive ? 'text-white' : 'text-white/20 group-hover:text-white/60'}
            `}>
              {c.label}
            </span>
            {isActive && (
              <motion.span
                layoutId="category-underline"
                className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-accent-red"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
