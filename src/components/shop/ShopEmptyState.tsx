'use client'
import { useShopStore } from '@/stores/shopStore'

export function ShopEmptyState() {
  const { resetFilters } = useShopStore()
  return (
    <div className="flex flex-col items-center justify-center py-40 px-6 text-center space-y-6">
      <p className="text-[10rem] font-black leading-none text-white/5 tracking-tighter uppercase select-none">NULL</p>
      <div className="space-y-2">
        <p className="text-[12px] font-black uppercase tracking-[0.3em] text-white/40">Zero_Results_Found</p>
        <p className="text-[10px] font-medium text-white/20 uppercase tracking-[0.1em]">No telemetry matches your current archive selection.</p>
      </div>
      <button
        onClick={resetFilters}
        className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/10 pb-1
                   hover:text-accent-red hover:border-accent-red transition-all"
      >
        Reset_Telemetry
      </button>
    </div>
  )
}
