"use client"

import { useState, Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/stores/cartStore"
import { toast } from "sonner"
import Image from "next/image"

const EASE = [0.22, 1, 0.36, 1] as const
type Mode  = "login" | "signup"

import AuthSplitLayout from "@/components/auth/AuthSplitLayout"
import LoginForm from "@/components/auth/LoginForm"
import SignupForm from "@/components/auth/SignupForm"

function AuthForm() {
  const params = useSearchParams()
  const modeParam = params.get("mode") as Mode | null
  const [mode, setMode] = useState<Mode>(modeParam || "login")

  // Show error from callback if present
  const urlError = params.get("error")
  const errorMessages: Record<string, string> = {
    invalid_link: "This confirmation link is invalid.",
    expired_link: "This link has expired. Please sign up again.",
    unexpected:   "Something went wrong. Please try again.",
  }

  return (
    <AuthSplitLayout 
      quote={mode === "login" ? "Welcome Back." : "Join the Archive."} 
      bgImage={mode === "login" ? "/images/photo_5994565660274527448_x.jpg" : "/images/photo_5994565660274527449_x.jpg"}
    >
      <div className="w-full space-y-6">
        {urlError && errorMessages[urlError] && (
          <div className="
            px-4 py-3 rounded-lg
            bg-red-500/10 border border-red-500/20
          ">
            <p className="text-red-400 text-xs tracking-wide">
              {errorMessages[urlError]}
            </p>
          </div>
        )}

        {mode === "login" ? (
          <LoginForm onToggle={() => setMode("signup")} />
        ) : (
          <SignupForm onToggle={() => setMode("login")} />
        )}
      </div>
    </AuthSplitLayout>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <AuthForm />
    </Suspense>
  )
}
