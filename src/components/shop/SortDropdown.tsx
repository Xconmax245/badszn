'use client'
import { ChevronDown } from 'lucide-react'
import { useShopStore, SortOption } from '@/stores/shopStore'

const OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Newest',      value: 'newest'     },
  { label: 'Price: Low',  value: 'price_asc'  },
  { label: 'Price: High', value: 'price_desc' },
  { label: 'Sale',        value: 'sale'       },
]

export function SortDropdown() {
  const { sort, setSort } = useShopStore()
  const current = OPTIONS.find(o => o.value === sort)

  return (
    <label className="relative flex items-center cursor-pointer group">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-white/60
                       transition-colors duration-300">
        {current?.label}
      </span>
      <select
        value={sort}
        onChange={e => setSort(e.target.value as SortOption)}
        className="absolute inset-0 opacity-0 cursor-pointer w-full"
      >
        {OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  )
}
