"use client"

import { useCartStore } from "@/stores/cartStore"
import Image from "next/image"
import PaymentButton from "./PaymentButton"
import { motion } from "framer-motion"

interface OrderSummaryProps {
  form: any
}

export default function OrderSummary({ form }: OrderSummaryProps) {
  const { items, subtotal, shipping, total } = useCartStore()
  const totalAmount = subtotal()

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sticky top-32 glass-aura rounded-[2.5rem] p-8 md:p-10 border border-white/10"
    >
      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-10">03 ORDER SUMMARY</h3>
      
      <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-4">
            <div className="relative w-16 h-20 bg-white/[0.03] rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
              <Image 
                src={item.image || ""} 
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 py-1">
              <p className="text-[11px] font-black text-white uppercase truncate tracking-tight">{item.name}</p>
              <p className="text-[9px] text-white/30 uppercase font-bold mt-1 tracking-widest">{item.size} • QTY {item.quantity}</p>
              <p className="text-[11px] font-bold text-white/60 mt-2">₦{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 border-t border-white/5 pt-8 mb-10">
        <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-white/40">
          <span>Subtotal</span>
          <span className="font-bold text-white/60">₦{totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-white/40">
          <span>Shipping</span>
          <span className="text-[10px] font-black text-white/60">
            {shipping() === 0 ? 'FREE' : `₦${shipping().toLocaleString()}`}
          </span>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <span className="text-[12px] font-black uppercase tracking-[0.2em] text-white">Total</span>
          <span className="text-xl font-black text-white text-aura-glow">₦{total().toLocaleString()}</span>
        </div>
      </div>

      <PaymentButton form={form} />

      <div className="mt-10 pt-10 border-t border-white/5 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/80">Orders processed within 24hrs</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-white/20 mt-0.5">Rapid Fulfillment Protocol</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/80">Secure Checkout</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-white/20 mt-0.5">Paystack Encrypted Gateway</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
