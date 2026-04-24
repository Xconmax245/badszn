"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"


const RESEND_TTL = 60  // seconds before resend is allowed again

function VerifyEmailContent() {
  const params   = useSearchParams()
  const router   = useRouter()
  const email    = params.get("email") ?? ""
  const redirect = params.get("redirect") ?? "/"

  const [resending,   setResending]   = useState(false)
  const [resentAt,    setResentAt]    = useState<number | null>(null)
  const [resendError, setResendError] = useState("")
  const [resentOk,    setResentOk]    = useState(false)

  const secondsSinceResend = resentAt
    ? Math.floor((Date.now() - resentAt) / 1000)
    : RESEND_TTL + 1

  const canResend = secondsSinceResend >= RESEND_TTL && !resending

  const handleResend = async () => {
    if (!canResend) return
    setResending(true)
    setResendError("")
    setResentOk(false)

    try {
      const supabase = createClient()
      const origin = window.location.origin
      const { error } = await supabase.auth.resend({
        type:  "signup",
        email,
        options: {
          emailRedirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
        }
      })
      if (error) throw error
      setResentAt(Date.now())
      setResentOk(true)
    } catch (err: any) {
      setResendError(err?.message ?? "Failed to resend. Try again.")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-6">

      {/* Back button */}
      <button
        onClick={() => router.push("/auth")}
        className="
          absolute top-6 left-6
          text-[10px] tracking-widest uppercase
          text-white/20 hover:text-white/40
          transition-colors duration-200
        "
      >
        ← Back
      </button>

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

        {/* Heading */}
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-black uppercase tracking-[-0.03em] text-white leading-none">
            Check your email
          </h1>
          <p className="text-white/40 text-sm leading-relaxed">
            Confirm your identity.
            <br />
            Access isn't automatic.
          </p>
        </div>

        {/* Email display */}
        {email && (
          <div className="
            px-5 py-3 rounded-full
            bg-white/[0.04] border border-white/[0.06]
          ">
            <p className="text-white/60 text-sm truncate">{email}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="flex flex-col gap-2 text-left">
          {[
            "Open your email inbox",
            "Find the message from BAD SZN",
            "Click the confirmation link",
            "You'll be redirected back here",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="
                w-5 h-5 rounded-full
                bg-white/[0.05] border border-white/[0.08]
                flex items-center justify-center
                flex-shrink-0 mt-0.5
                text-[10px] font-black text-white/30
              ">
                {i + 1}
              </span>
              <span className="text-white/40 text-sm">{step}</span>
            </div>
          ))}
        </div>

        {/* Resend section */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06]">
          {resentOk && (
            <p className="text-green-400 text-xs tracking-wide">
              Sent again. Check your inbox.
            </p>
          )}
          {resendError && (
            <p className="text-red-400 text-xs tracking-wide">
              {resendError}
            </p>
          )}
          <button
            onClick={handleResend}
            disabled={!canResend}
            className="
              text-[10px] tracking-widest uppercase
              text-white/20 hover:text-white/40
              disabled:opacity-30 disabled:cursor-not-allowed
              transition-colors duration-200
            "
          >
            {resending
              ? "Sending..."
              : !canResend && resentAt
              ? `Resend in ${RESEND_TTL - secondsSinceResend}s`
              : "Didn't get it? Resend →"
            }
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  )
}
