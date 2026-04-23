"use client"

import { useCartStore } from "@/stores/cartStore"
import Image from "next/image"
import PaymentButton from "./PaymentButton"
import { motion } from "framer-motion"

interface OrderSummaryProps {
  form: any
}

export default function OrderSummary({ form }: OrderSummaryProps) {
  const { items, subtotal } = useCartStore()
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
          <span className="text-[10px] font-black text-emerald-500/80">FREE_GLOBAL</span>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <span className="text-[12px] font-black uppercase tracking-[0.2em] text-white">Total</span>
          <span className="text-xl font-black text-white text-aura-glow">₦{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <PaymentButton form={form} />
    </motion.div>
  )
}
