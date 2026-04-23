'use client'
import { useShopStore } from '@/stores/shopStore'

export function ActiveFilters() {
  const {
    category, sizes, availability, sort, search,
    resetFilters,
  } = useShopStore()

  const parts: string[] = []
  if (category)              parts.push(category)
  if (sizes.length)          parts.push(sizes.join(', '))
  if (availability !== 'all') parts.push(availability.replace('_', ' '))
  if (sort !== 'newest')     parts.push(sort.replace('_', ' '))
  if (search)                parts.push(`"${search}"`)

  if (!parts.length) return null

  return (
    <div className="flex items-center gap-4 mt-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
        Active Telemetry: {parts.join(' // ')}
      </p>
      <div className="h-px w-4 bg-white/5" />
      <button
        onClick={resetFilters}
        className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-accent-red transition-colors"
      >
        Reset_Filters
      </button>
    </div>
  )
}
