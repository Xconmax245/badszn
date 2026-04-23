'use client'

import { useState } from 'react'
import { useCartStore } from '@/stores/cartStore'

export default function CouponField() {
  const [code, setCode]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const { applyCoupon, removeCoupon, coupon, subtotal } = useCartStore()

  const handleApply = async () => {
    if (!code.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/cart/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: subtotal() }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      applyCoupon(data)
      setCode('')
    } catch {
      setError('Failed to apply code')
    } finally {
      setLoading(false)
    }
  }

  if (coupon?.isValid) {
    return (
      <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-green-500/5 border border-green-500/10">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] tracking-widest uppercase text-green-400 font-bold">Applied</span>
          <span className="text-sm font-bold text-white">{coupon.code}</span>
        </div>
        <button onClick={removeCoupon} className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors">
          Remove
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setError('') }}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          placeholder="Promo code"
          className="flex-1 px-4 py-3 rounded-full bg-white/[0.04] border border-white/[0.08] text-white text-sm uppercase tracking-widest placeholder:text-white/20 placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:border-white/20 transition-colors"
        />
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="px-6 py-3 rounded-full bg-white text-black text-[11px] font-black tracking-widest uppercase hover:bg-white/90 disabled:opacity-30 transition-all"
        >
          {loading ? '...' : 'Apply'}
        </button>
      </div>
      {error && <p className="text-red-400 text-xs pl-4">{error}</p>}
    </div>
  )
}
