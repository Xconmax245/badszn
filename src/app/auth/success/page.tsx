"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"


const REDIRECT_MS = 2500  // redirect after 2.5 seconds

function SuccessContent() {
  const params   = useSearchParams()
  const router   = useRouter()
  const redirect = params.get("redirect") ?? "/"

  useEffect(() => {
    // Auto-redirect after delay
    const timer = setTimeout(() => {
      router.push(redirect)
      router.refresh()
    }, REDIRECT_MS)

    return () => clearTimeout(timer)
  }, [redirect])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="w-full max-w-sm flex flex-col gap-8 text-center"
      >
        {/* Brand */}
        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-red-500">
          BAD SZN
        </span>

        {/* Success indicator */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="
            w-12 h-12 rounded-full
            border border-white/20
            flex items-center justify-center
            mx-auto
          "
        >
          <span className="text-white text-lg">✓</span>
        </motion.div>

        {/* Message */}
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-black uppercase tracking-[-0.03em] text-white leading-none">
            Identity Verified
          </h1>
          <p className="text-white/40 text-sm">
            Welcome to BAD SZN.
          </p>
        </div>

        {/* Redirect indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-[10px] tracking-widest uppercase text-white/20"
        >
          Redirecting...
        </motion.p>
      </motion.div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  )
}
