"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useCartStore } from "@/stores/cartStore"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, CheckCircle2, AlertCircle, ShoppingBag } from "lucide-react"

type PaymentState = "PROCESSING" | "CONFIRMED" | "FAILED" | "DELAYED"

function SuccessContent() {
  const params = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCartStore()
  const reference = params.get("reference")
  const [status, setStatus] = useState<PaymentState>("PROCESSING")

  useEffect(() => {
    if (!reference) {
      setStatus("FAILED")
      return
    }

    let attempts = 0
    const maxAttempts = 6
    
    const checkPayment = async () => {
      try {
        const res = await fetch(`/api/paystack/verify?reference=${reference}`)
        const data = await res.json()

        if (data.status === "PAID") {
          setStatus("CONFIRMED")
          clearCart()
          setTimeout(() => {
            router.push("/order/confirmation")
          }, 2000)
          return
        }

        if (attempts < maxAttempts) {
          attempts++
          setTimeout(checkPayment, 2500)
        } else {
          setStatus("DELAYED")
        }
      } catch (err) {
        setStatus("FAILED")
      }
    }

    checkPayment()
  }, [reference, clearCart, router])

  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6 bg-black">
      <div className="max-w-sm w-full flex flex-col gap-6 relative">
        {/* Subtle background aura */}
        <div className="absolute inset-0 bg-white/[0.02] blur-3xl rounded-full -z-10" />

        <div className="space-y-2">
          <p className="text-[12px] tracking-[0.04em] text-white/50 font-medium">
            {status === "PROCESSING" && "Checking your payment…"}
            {status === "CONFIRMED" && "Payment confirmed."}
            {status === "DELAYED" && "Still confirming your payment…"}
            {status === "FAILED" && "Payment not confirmed."}
          </p>

          <h1 className="text-2xl font-semibold text-white tracking-tight leading-tight">
            {status === "PROCESSING" && "Please wait a moment"}
            {status === "CONFIRMED" && "Your order is in"}
            {status === "DELAYED" && "This is taking longer than expected"}
            {status === "FAILED" && "Something went wrong"}
          </h1>
        </div>

        {status === "DELAYED" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <p className="text-sm leading-relaxed text-white/60">
              If you’ve been charged, your order will update shortly.
              You can safely close this page.
            </p>
            <button 
              onClick={() => router.push('/shop')}
              className="text-[12px] font-semibold text-white/40 hover:text-white transition-colors underline underline-offset-8"
            >
              Return to Shop
            </button>
          </motion.div>
        )}

        {status === "FAILED" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <p className="text-sm leading-relaxed text-white/60">
              If you were charged, please contact support with your payment reference.
            </p>
            <button 
              onClick={() => router.push('/cart')}
              className="text-[12px] font-semibold text-white px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all"
            >
              Back to Cart
            </button>
          </motion.div>
        )}

        {status === "PROCESSING" && (
          <div className="flex justify-center pt-4">
            <Loader2 className="w-5 h-5 text-white/20 animate-spin" />
          </div>
        )}
      </div>
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
