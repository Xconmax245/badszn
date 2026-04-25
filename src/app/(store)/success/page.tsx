"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useCartStore } from "@/stores/cartStore"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, CheckCircle2, AlertCircle, ShoppingBag } from "lucide-react"

function SuccessContent() {
  const params = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCartStore()
  const reference = params.get("reference")
  const [status, setStatus] = useState<"loading" | "paid" | "failed">("loading")

  useEffect(() => {
    if (!reference) {
      setStatus("failed")
      return
    }

    let attempts = 0
    const maxAttempts = 10 // Increase attempts for slow webhooks
    
    const checkPayment = async () => {
      try {
        const res = await fetch(`/api/paystack/verify?reference=${reference}`)
        const data = await res.json()

        if (data.status === "PAID") {
          setStatus("paid")
          clearCart()
          // Short delay to show success state before redirecting to a clean order-confirmed page
          setTimeout(() => {
            router.push("/order/confirmation")
          }, 3000)
          return
        }

        // Retry if still pending
        if (attempts < maxAttempts) {
          attempts++
          setTimeout(checkPayment, 3000) // Poll every 3 seconds
        } else {
          setStatus("failed")
        }
      } catch (err) {
        console.error("Success page polling error:", err)
        setStatus("failed")
      }
    }

    checkPayment()
  }, [reference, clearCart, router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Aura background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="relative z-10 space-y-8"
          >
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse" />
                <div className="w-20 h-20 bg-white/[0.03] border border-white/10 rounded-full flex items-center justify-center relative">
                  <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-white/20 text-[10px] font-black tracking-[0.4em] uppercase italic">Authorization_Pending</p>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
                Synchronizing <br/> <span className="text-white/40">Deployment</span>
              </h1>
              <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed">
                Verifying payment signature with the network. Please do not close this window.
              </p>
            </div>
          </motion.div>
        )}

        {status === "paid" && (
          <motion.div 
            key="paid"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 space-y-8"
          >
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl" />
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center relative">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-emerald-500 text-[10px] font-black tracking-[0.4em] uppercase italic">Payment_Confirmed</p>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
                Order <br/> <span className="text-white/40">Successful</span>
              </h1>
              <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed">
                Your credentials have been verified. Redirecting to confirmation protocol...
              </p>
            </div>
          </motion.div>
        )}

        {status === "failed" && (
          <motion.div 
            key="failed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 space-y-8"
          >
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl" />
                <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center relative">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <p className="text-red-500 text-[10px] font-black tracking-[0.4em] uppercase italic">Verification_Failed</p>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
                  Registry <br/> <span className="text-white/40">Conflict</span>
                </h1>
                <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed">
                  We could not confirm your payment status. If funds were deducted, please contact support.
                </p>
              </div>
              <button 
                onClick={() => router.push('/cart')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-white/90 transition-all active:scale-95"
              >
                <ShoppingBag size={14} /> Return to Cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
