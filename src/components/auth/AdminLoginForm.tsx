"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Lock } from "lucide-react"

export default function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorText("Please enter both email and password.")
      return
    }

    setLoading(true)
    setErrorText("")

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorText(data.error || "Login failed.")
        return
      }

      window.location.href = "/admin"
    } catch (error) {
      setErrorText("Connection error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-12 flex flex-col items-center justify-center border-b border-white/5 pb-8">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
          <Lock className="w-5 h-5 text-white/40" />
        </div>
        <h2 className="text-[11px] tracking-[0.3em] uppercase text-white/60 font-black">Admin Access</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-sm mx-auto">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-[11px] text-white placeholder:text-white/10 focus:border-white/30 focus:bg-white/[0.05] transition-all outline-none"
              placeholder="admin@badszn.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-[11px] text-white focus:border-white/30 focus:bg-white/[0.05] transition-all outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/90 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Sign In"}
        </button>

        {errorText && (
          <p className="text-[10px] text-red-500 text-center uppercase tracking-widest font-black">
            {errorText}
          </p>
        )}
      </form>
    </div>
  )
}
