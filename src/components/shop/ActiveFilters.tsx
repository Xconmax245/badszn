'use client'
import { X } from 'lucide-react'
import { useShopStore } from '@/stores/shopStore'

export function ActiveFilters() {
  const { category, sizes, availability, sort, search,
          setCategory, toggleSize, setAvailability, setSort, setSearch, resetFilters } = useShopStore()

  const hasActive = category || sizes.length || availability !== 'all' || sort !== 'newest' || search

  if (!hasActive) return null

  return (
    <div className="flex items-center gap-2 mt-3 flex-wrap">
      <span className="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase">Active_Filters:</span>

      {category && (
        <Pill label={category.toUpperCase()} onRemove={() => setCategory(null)} />
      )}
      {sizes.map(s => (
        <Pill key={s} label={s} onRemove={() => toggleSize(s)} />
      ))}
      {availability !== 'all' && (
        <Pill label={availability.replace('_', ' ').toUpperCase()} onRemove={() => setAvailability('all')} />
      )}
      {sort !== 'newest' && (
        <Pill label={sort.replace('_', ' ').toUpperCase()} onRemove={() => setSort('newest')} />
      )}
      {search && (
        <Pill label={`"${search}"`} onRemove={() => setSearch('')} />
      )}

      <button
        onClick={resetFilters}
        className="font-mono text-[9px] text-accent-red underline underline-offset-4 ml-2 tracking-widest hover:text-accent-red-hover transition-colors"
      >
        CLEAR_ALL
      </button>
    </div>
  )
}

function Pill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 bg-white/5 border border-white/10
                     font-mono text-[10px] text-white/40 px-2 py-1">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors">
        <X size={10} />
      </button>
    </span>
  )
}
