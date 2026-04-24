"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error
      setMessage("Reset link dispatched. Check your inbox.")
    } catch (err: any) {
      setError(err.message || "Failed to initiate reset protocol.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-12"
      >
        <Link 
          href="/auth"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors"
        >
          <ArrowLeft size={12} />
          Return to Terminal
        </Link>

        <div className="space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Regain access.</h1>
          <p className="text-white/40 text-sm tracking-wide leading-relaxed">
            Continue where you left off. Enter your email to receive a recovery link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Email Identifier</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="SYSTEM@BADSZN.COM"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-[11px] font-black uppercase tracking-widest text-white placeholder:text-white/10 focus:border-white/40 focus:bg-white/[0.05] transition-all outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initiate Recovery"}
          </button>

          {message && (
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-2">
              {message}
            </p>
          )}

          {error && (
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </p>
          )}
        </form>
      </motion.div>
    </div>
  )
}
