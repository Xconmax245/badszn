'use client'

import { useRef } from 'react'
import { X } from 'lucide-react'
import { useShopStore } from '@/stores/shopStore'

export function SearchBar() {
  const { search, setSearch } = useShopStore()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative group">
      <input
        ref={inputRef}
        type="text"
        placeholder="SEARCH"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="
          bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-white
          placeholder:text-white/20 w-16 focus:w-32 md:w-20 md:focus:w-40
          transition-all duration-700 outline-none
          border-b border-transparent focus:border-white/20
          pb-1
        "
      />
      {search && (
        <button
          onClick={() => setSearch('')}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
        >
          <X size={10} />
        </button>
      )}
    </div>
  )
}
