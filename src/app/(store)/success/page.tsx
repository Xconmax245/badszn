"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, ArrowRight, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/stores/cartStore"

export default function SuccessPage() {
  const { clearCart } = useCartStore()

  useEffect(() => {
    // Clear the cart on successful checkout
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg text-center space-y-12"
      >
        <div className="flex flex-col items-center space-y-8">
          <div className="w-20 h-20 bg-white/[0.03] border border-white/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="text-white/40" size={40} strokeWidth={1.5} />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Order Confirmed</h1>
            <p className="text-white/40 text-sm font-medium tracking-wide leading-relaxed max-w-sm mx-auto">
              Your acquisition has been registered. You will receive a confirmation message shortly with your details.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/account/orders" 
            className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/90 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            View Orders <ArrowRight size={14} />
          </Link>
          
          <Link 
            href="/shop" 
            className="w-full sm:w-auto bg-white/[0.05] border border-white/10 text-white px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <ShoppingBag size={14} /> Continue Shopping
          </Link>
        </div>

        <div className="pt-12 border-t border-white/5">
          <p className="text-[10px] font-black text-white/15 uppercase tracking-[0.4em]">Thank you for your support</p>
        </div>
      </motion.div>
    </div>
  )
}
