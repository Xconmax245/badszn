export default function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const threshold = 30000
  const progress  = Math.min((subtotal / threshold) * 100, 100)
  const remaining = Math.max(threshold - subtotal, 0)
  const earned    = subtotal >= threshold

  return (
    <div className="flex flex-col gap-2 py-4">
      <p className="text-[11px] tracking-widest uppercase font-medium text-white/60">
        {earned
          ? "✓ You've earned free shipping!"
          : `₦${remaining.toLocaleString('en-NG')} away from free shipping`}
      </p>
      <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${earned ? 'bg-green-500' : 'bg-white'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
