'use client'

import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useCartStore } from '@/stores/cartStore'
import CouponField from './CouponField'
import CouponField from './CouponField'

function CheckoutButton() {
  const router   = useRouter()
  const supabase = getSupabaseBrowserClient()

  const handleCheckout = async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      router.push("/auth?redirect=/checkout")
      return
    }

    router.push("/checkout")
  }

  return (
    <button
      onClick={handleCheckout}
      className="
        w-full flex items-center justify-center
        py-4 rounded-full
        bg-white text-black
        text-[12px] font-black tracking-[0.2em] uppercase
        hover:bg-red-600 hover:text-white
        transition-all duration-300
        active:scale-[0.98]
      "
    >
      Proceed to Checkout →
    </button>
  )
}

export default function CartSummary() {
  const { subtotal, discountAmount, shipping, total, coupon } = useCartStore()

  const sub      = subtotal()
  const discount = discountAmount()
  const ship     = shipping()
  const tot      = total()

  return (
    <div className="flex flex-col gap-6 sticky top-28 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
      <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Order Summary</h3>

      <CouponField />

      <div className="flex flex-col gap-3 py-4 border-y border-white/[0.06]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/50">Subtotal</span>
          <span className="text-sm font-medium text-white">₦{sub.toLocaleString('en-NG')}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-400">Discount{coupon?.code ? ` (${coupon.code})` : ''}</span>
            <span className="text-sm font-medium text-green-400">−₦{discount.toLocaleString('en-NG')}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/50">Shipping</span>
          <span className="text-sm font-medium text-white">{ship === 0 ? 'Free' : `₦${ship.toLocaleString('en-NG')}`}</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <span className="text-base font-black uppercase tracking-wider text-white">Total</span>
          <span className="text-base font-black text-white">₦{tot.toLocaleString('en-NG')}</span>
        </div>
      </div>

      <CheckoutButton />
      <Link href="/shop" className="text-center text-[10px] tracking-widest uppercase text-white/30 hover:text-white/60 transition-colors">
        ← Continue Shopping
      </Link>

      <div className="flex items-center justify-center gap-6 pt-2">
        {['Secure Checkout', 'Easy Returns', 'Authentic'].map((b) => (
          <span key={b} className="text-[9px] tracking-widest uppercase text-white/15 text-center">{b}</span>
        ))}
      </div>
    </div>
  )
}
