"use client"

import { useEffect } from "react"
import { useCartStore } from "@/stores/cartStore"
import { motion } from "framer-motion"
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  const { clearCart } = useCartStore()

  useEffect(() => {
    // Clear cart on mount
    clearCart()
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 pt-20">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-black text-white uppercase tracking-tighter mb-6"
        >
          Order Confirmed
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[11px] font-bold text-white/30 uppercase tracking-[0.3em] leading-relaxed mb-12"
        >
          Your payment was successful. Our logistics team is now preparing your shipment for the season.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <Link
            href="/account"
            className="w-full bg-white text-black py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/90 transition-all"
          >
            Track Order
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link
            href="/shop"
            className="w-full bg-white/[0.03] border border-white/5 text-white/40 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/[0.05] hover:text-white transition-all"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>

      {/* Background Decorative Aura */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>
    </div>
  )
}
