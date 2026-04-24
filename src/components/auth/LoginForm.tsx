"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Loader2, Check } from "lucide-react"

export default function LoginForm({ onToggle }: { onToggle?: () => void }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const [errorText, setErrorText] = useState("")

  const triggerShake = (msg: string) => {
    setErrorText(msg)
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return triggerShake("Please fill out all fields.")
    
    setLoading(true)
    setErrorText("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        triggerShake(data.error || "Authentication failed.")
        return
      }

      // Success - Redirect to target or homepage
      router.push(redirectTo)
    } catch (error: any) {
      console.error("DEBUG: Fetch Failed Details:", {
        message: error.message,
        stack: error.stack,
        url: "/api/auth/login"
      });
      triggerShake("System offline. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-[-0.04em] text-white">
          WELCOME BACK.
        </h2>
        <p className="text-white/50 text-sm font-medium tracking-widest uppercase mt-4">
          Access your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative space-y-8">
        <div className="space-y-6">
          <motion.div 
            animate={shake ? { x: [-4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="space-y-2 relative group"
          >
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold italic">Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR EMAIL..."
              className="w-full bg-transparent border-b border-white/[0.08] text-white py-3 px-0 focus:outline-none focus:border-white transition-colors placeholder:text-white/20 placeholder:tracking-widest placeholder:text-[10px]"
              data-cursor="text"
            />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent-red scale-x-0 origin-left group-focus-within:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          </motion.div>

          <motion.div 
            animate={shake ? { x: [-4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="space-y-2 relative group"
          >
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold italic">Password</label>
            </div>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/[0.08] text-white py-3 px-0 focus:outline-none focus:border-white transition-colors"
              data-cursor="text"
            />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent-red scale-x-0 origin-left group-focus-within:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          </motion.div>
        </div>

        <div className="flex items-center justify-between text-xs tracking-wider uppercase text-white/50 pt-2 font-medium">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <input type="checkbox" id="remember" className="peer appearance-none w-4 h-4 border border-white/20 bg-transparent checked:border-accent-red transition-all cursor-pointer" data-cursor="hover" />
              <div className="absolute inset-0 pointer-events-none opacity-0 peer-checked:opacity-100 bg-accent-red transition-opacity scale-50" />
            </div>
            <label htmlFor="remember" className="cursor-pointer" data-cursor="hover">Remember</label>
          </div>
          <Link 
            href="/auth/forgot-password" 
            className="hover:text-white transition-colors" 
            data-cursor="hover"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          data-cursor="hover"
          className="
            w-full relative overflow-hidden group
            bg-white text-black py-4 rounded-full
            flex items-center justify-center gap-2
            hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            disabled:opacity-50 disabled:hover:scale-100
          "
        >
          <div className="absolute inset-0 bg-accent-red translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          <span className="relative z-10 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] group-hover:text-white transition-colors duration-500">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authenticate"}
          </span>
        </button>

        {/* Simple Minimal Error UI */}
        <AnimatePresence>
          {errorText && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-600 text-[10px] font-bold uppercase tracking-widest pt-2"
            >
              {errorText}
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      <div className="mt-12 text-center">
        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30">
          No access yet?{" "}
          {onToggle ? (
            <button 
              onClick={onToggle}
              className="text-white hover:text-accent-red transition-colors underline underline-offset-4 decoration-white/10" 
              data-cursor="hover"
            >
              Request Access <ArrowRight className="inline-block w-3 h-3 ml-1 -mt-0.5" />
            </button>
          ) : (
            <Link href="/signup" className="text-white hover:text-accent-red transition-colors" data-cursor="hover">
              Request Access <ArrowRight className="inline-block w-3 h-3 ml-1 -mt-0.5" />
            </Link>
          )}
        </p>
      </div>
    </div>
  )
}
