"use client"

export function GrowthBadge({ value }: { value: number }) {
  if (value === 0) return (
    <span className="text-white/30 text-[9px] tracking-widest font-bold uppercase">No change</span>
  )

  const isPositive = value > 0
  return (
    <span className={`text-[9px] font-bold tracking-widest uppercase ${
      isPositive ? "text-emerald-500" : "text-red-500"
    }`}>
      {isPositive ? "+" : ""}{value}%
    </span>
  )
}
