export function ProductCardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="aspect-[3/4] bg-white/[0.03] animate-pulse border border-white/5" />
      <div className="space-y-3 px-1">
        <div className="h-2.5 bg-white/[0.05] w-2/3 animate-pulse" />
        <div className="h-2 bg-white/[0.02] w-1/4 animate-pulse" />
      </div>
    </div>
  )
}
