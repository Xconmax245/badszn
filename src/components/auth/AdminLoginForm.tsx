"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Shield } from "lucide-react"

export default function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  // Rate limiting & Security states
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked] = useState(false)
  
  // Terminal Error State
  const [errorText, setErrorText] = useState("")
  const [isGlitching, setIsGlitching] = useState(false)

  const triggerError = (msg: string) => {
    setErrorText(msg)
    setIsGlitching(true)
    
    // Increment attempts
    const newAttempts = attempts + 1
    if (newAttempts >= 3) {
      setLocked(true)
      setErrorText("SYSTEM LOCKED. EXCEEDED ATTEMPTS.")
    } else {
      setAttempts(newAttempts)
    }

    setTimeout(() => setIsGlitching(false), 500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (locked) return
    
    if (!email || !password) {
      return triggerError("ACCESS DENIED. INVALID PARAMETERS.")
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
        triggerError(data.error || "ACCESS DENIED.")
        return
      }

      // Success - Redirect to admin dashboard
      window.location.href = "/admin"
    } catch (error) {
      triggerError("SYSTEM OFFLINE. TRY AGAIN.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full font-mono">
      <div className="mb-12 flex flex-col items-center justify-center border-b border-red-500/20 pb-8">
        <Shield className="w-10 h-10 text-red-500 mb-4 opacity-80" />
        <h2 className="text-xl tracking-[0.3em] uppercase text-red-500 font-bold">Secure Node</h2>
        <p className="text-zinc-600 text-xs mt-2 tracking-widest uppercase">Admin clearance required</p>
      </div>

      <form onSubmit={handleSubmit} className="relative space-y-6 max-w-sm mx-auto">
        <div className="space-y-6">
          <div className="space-y-1 relative group">
            <label className="text-[10px] uppercase tracking-widest text-red-500/60 font-bold italic">Admin Email</label>
            <input 
              type="text" // generic type avoids browser autocomplete styles overriding the terminal vibe
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={locked}
              className="w-full bg-transparent border-b border-zinc-800 text-zinc-300 py-2 px-0 focus:outline-none focus:border-red-500/50 transition-colors placeholder:text-zinc-800 disabled:opacity-50"
              placeholder="SYSTEM@BADSZN.COM"
              spellCheck={false}
            />
          </div>

          <div className="space-y-1 relative group">
            <label className="text-[10px] uppercase tracking-widest text-red-500/60 font-bold italic">Admin Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={locked}
              className="w-full bg-transparent border-b border-zinc-800 text-zinc-300 py-2 px-0 focus:outline-none focus:border-red-500/50 transition-colors disabled:opacity-50"
              spellCheck={false}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || locked}
          className="w-full bg-red-950/20 border border-red-500/30 text-red-500 text-xs uppercase tracking-[0.2em] font-bold py-4 mt-4 hover:bg-red-500 hover:text-black transition-all duration-300 disabled:opacity-30 disabled:hover:bg-red-950/20 disabled:hover:text-red-500"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : locked ? "SYSTEM LOCKED" : "Authenticate"}
        </button>

        {/* Glitch Validation Output */}
        <div className="h-6 mt-4 flex items-center justify-center">
          <AnimatePresence>
            {errorText && (
              <motion.p 
                key={errorText}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1, 
                  x: isGlitching ? [0, -5, 5, -5, 5, 0] : 0,
                  filter: isGlitching ? ["blur(2px)", "blur(0px)"] : "blur(0)",
                  color: isGlitching ? ["#ffffff", "#ef4444", "#ef4444"] : "#ef4444" 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-[11px] text-red-500 tracking-widest"
                style={{ textShadow: isGlitching ? "2px 0 0 #0ff, -2px 0 0 #f00" : "none" }}
              >
                {errorText}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  )
}
