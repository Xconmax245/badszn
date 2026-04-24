"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { Loader2, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Credentials do not match.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error
      setSuccess(true)
      setTimeout(() => router.push("/auth"), 2000)
    } catch (err: any) {
      setError(err.message || "Failed to update security credentials.")
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
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="text-white/40" size={32} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Security Update</h1>
          <p className="text-white/40 text-sm tracking-wide leading-relaxed">
            Establish new access credentials for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-[11px] font-black uppercase tracking-widest text-white placeholder:text-white/10 focus:border-white/40 focus:bg-white/[0.05] transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Confirm Credentials</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-[11px] font-black uppercase tracking-widest text-white placeholder:text-white/10 focus:border-white/40 focus:bg-white/[0.05] transition-all outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-white text-black py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? "Protocol Updated" : "Update Access"}
          </button>

          {success && (
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-2">
              Credentials updated. Redirecting to Terminal...
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
