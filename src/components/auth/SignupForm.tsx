"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Loader2, Check } from "lucide-react"

// Types
type Step = "EMAIL" | "NAME" | "USERNAME" | "PASSWORD"

export default function SignupForm() {
  const [step, setStep] = useState<Step>("EMAIL")
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  
  // Data
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  // Validation state
  const [errorText, setErrorText] = useState("")

  // Triggers soft shake
  const triggerShake = (msg: string) => {
    setErrorText(msg)
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  const handleNext = () => {
    setErrorText("")
    if (step === "EMAIL") {
      if (!email.includes("@")) return triggerShake("Please enter a valid email.")
      setStep("NAME")
    } else if (step === "NAME") {
      if (firstName.length < 2) return triggerShake("First name is required.")
      if (lastName.length < 2) return triggerShake("Last name is required.")
      setStep("USERNAME")
    } else if (step === "USERNAME") {
      if (username.length < 3) return triggerShake("Username must be at least 3 characters.")
      setStep("PASSWORD")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) return triggerShake("Password must be at least 8 characters.")
    
    setLoading(true)
    setErrorText("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName, username }),
      })

      const data = await response.json()

      if (!response.ok) {
        triggerShake(data.error || "Registration failed.")
        return
      }

      // Success - Redirect to account dashboard
      window.location.href = "/account"
    } catch (error) {
      triggerShake("System offline. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Password Strength Math
  const getStrength = () => {
    let score = 0
    if (password.length > 7) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9!@#\$%\^\&*\)\(+=._-]/.test(password)) score += 1
    return score
  }
  const strength = getStrength()

  return (
    <div className="w-full">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-[-0.04em] text-white">
          ENTER BAD SZN.
        </h2>
        <p className="text-white/50 text-sm font-medium tracking-widest uppercase mt-4">
          Request system access.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: EMAIL */}
          {step === "EMAIL" && (
            <motion.div
              key="step-email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
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
                  placeholder="YOUR@EMAIL.COM"
                  className="w-full bg-transparent border-b border-white/[0.08] text-white py-3 px-0 focus:outline-none focus:border-white transition-colors placeholder:text-white/20 placeholder:tracking-widest placeholder:text-[10px]"
                  autoFocus
                  data-cursor="text"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleNext())}
                />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent-red scale-x-0 origin-left group-focus-within:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              </motion.div>
              <button
                type="button"
                onClick={handleNext}
                data-cursor="hover"
                className="
                  w-full relative overflow-hidden group
                  bg-white text-black font-black uppercase text-xs tracking-[0.18em] py-4 rounded-full
                  flex items-center justify-center gap-2
                  hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                "
              >
                <div className="absolute inset-0 bg-accent-red translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-500">
                  Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>
          )}

          {/* STEP 2: NAME */}
          {step === "NAME" && (
            <motion.div
              key="step-name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">
                <motion.div 
                  animate={shake ? { x: [-4, 4, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="space-y-2 relative group"
                >
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold italic">First Name</label>
                  <input 
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-transparent border-b border-white/[0.08] text-white py-3 px-0 focus:outline-none focus:border-white transition-colors"
                    autoFocus
                    data-cursor="text"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent-red scale-x-0 origin-left group-focus-within:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                </motion.div>
                <motion.div 
                  animate={shake ? { x: [-4, 4, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="space-y-2 relative group"
                >
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold italic">Last Name</label>
                  <input 
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-transparent border-b border-white/[0.08] text-white py-3 px-0 focus:outline-none focus:border-white transition-colors"
                    data-cursor="text"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleNext())}
                  />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent-red scale-x-0 origin-left group-focus-within:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                </motion.div>
              </div>
              <button
                type="button"
                onClick={handleNext}
                data-cursor="hover"
                className="
                  w-full relative overflow-hidden group
                  bg-white text-black font-black uppercase text-xs tracking-[0.18em] py-4 rounded-full
                  flex items-center justify-center gap-2
                  hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                "
              >
                <div className="absolute inset-0 bg-accent-red translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-500">
                  Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>
          )}

          {/* STEP 3: USERNAME */}
          {step === "USERNAME" && (
            <motion.div
              key="step-username"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <motion.div 
                animate={shake ? { x: [-4, 4, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="space-y-2 relative group"
              >
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold italic">Codename (Username)</label>
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-white/30 font-bold">@</span>
                  <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                    placeholder="CHOOSE_IDENTITY"
                    className="w-full bg-transparent border-b border-white/[0.08] text-white py-3 pl-6 pr-0 focus:outline-none focus:border-white transition-colors placeholder:text-white/10 uppercase tracking-widest"
                    autoFocus
                    data-cursor="text"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleNext())}
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent-red scale-x-0 origin-left group-focus-within:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              </motion.div>
              <button
                type="button"
                onClick={handleNext}
                data-cursor="hover"
                className="
                  w-full relative overflow-hidden group
                  bg-white text-black font-black uppercase text-xs tracking-[0.18em] py-4 rounded-full
                  flex items-center justify-center gap-2
                  hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                "
              >
                <div className="absolute inset-0 bg-accent-red translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-500">
                  Assign Identity <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>
          )}

          {/* STEP 4: PASSWORD */}
          {step === "PASSWORD" && (
            <motion.div
              key="step-password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <motion.div 
                animate={shake ? { x: [-4, 4, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="space-y-2 relative group"
              >
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold italic">Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-white/[0.08] text-white py-3 px-0 focus:outline-none focus:border-white transition-colors"
                  autoFocus
                  data-cursor="text"
                />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent-red scale-x-0 origin-left group-focus-within:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                
                {/* Password Strength Indicator */}
                <div className="flex gap-1 h-0.5 w-full mt-4">
                  <div className={`h-full flex-1 rounded-full transition-colors duration-500 ${strength >= 1 ? "bg-accent-red" : "bg-white/10"}`} />
                  <div className={`h-full flex-1 rounded-full transition-colors duration-500 ${strength >= 2 ? "bg-orange-500" : "bg-white/10"}`} />
                  <div className={`h-full flex-1 rounded-full transition-colors duration-500 ${strength >= 3 ? "bg-white" : "bg-white/10"}`} />
                </div>
              </motion.div>

              <div className="flex items-center gap-3 pt-2 text-[10px] uppercase tracking-wider font-bold text-white/50">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" id="waitlist" className="peer appearance-none w-4 h-4 border border-white/20 bg-transparent checked:border-accent-red transition-all cursor-pointer" data-cursor="hover" defaultChecked />
                  <div className="absolute inset-0 pointer-events-none opacity-0 peer-checked:opacity-100 bg-accent-red transition-opacity scale-50" />
                </div>
                <label htmlFor="waitlist" className="cursor-pointer" data-cursor="hover">Join Waitlists Automatically</label>
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
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>ENTER BAD SZN <span className="ml-1 opacity-50">✦</span></>}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brutalist Alert Strip */}
        <AnimatePresence>
          {errorText && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-8 bg-accent-red/10 border-l-4 border-accent-red p-4 flex items-center justify-between">
                <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-accent-red">
                  {errorText}
                </p>
                <button 
                  onClick={() => setErrorText("")}
                  className="text-accent-red hover:text-white transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="mt-12 text-center">
        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30">
          Already have access?{" "}
          <Link href="/login" className="text-white hover:text-accent-red transition-colors" data-cursor="hover">
            Sign In.
          </Link>
        </p>
      </div>
    </div>
  )
}
