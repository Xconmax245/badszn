import { create } from 'zustand'

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'sale'
export type AvailabilityOption = 'all' | 'in_stock' | 'on_sale'

interface ShopStore {
  category:     string | null
  sizes:        string[]
  sort:         SortOption
  availability: AvailabilityOption
  search:       string
  page:         number
  setCategory:     (v: string | null)       => void
  toggleSize:      (v: string)              => void
  setSort:         (v: SortOption)          => void
  setAvailability: (v: AvailabilityOption)  => void
  setSearch:       (v: string)             => void
  setPage:         (v: number)             => void
  resetFilters:    ()                       => void
}

export const useShopStore = create<ShopStore>((set) => ({
  category:     null,
  sizes:        [],
  sort:         'newest',
  availability: 'all',
  search:       '',
  page:         1,
  setCategory:     (v)  => set({ category: v,    page: 1 }),
  toggleSize:      (v)  => set((s) => ({
    sizes: s.sizes.includes(v) ? s.sizes.filter(x => x !== v) : [...s.sizes, v],
    page: 1,
  })),
  setSort:         (v)  => set({ sort: v,         page: 1 }),
  setAvailability: (v)  => set({ availability: v, page: 1 }),
  setSearch:       (v)  => set({ search: v,       page: 1 }),
  setPage:         (v)  => set({ page: v }),
  resetFilters:    ()   => set({ category: null, sizes: [], sort: 'newest', availability: 'all', search: '', page: 1 }),
}))
