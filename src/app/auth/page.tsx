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

  return (
    <AuthSplitLayout 
      quote={mode === "login" ? "Welcome Back." : "Join the Archive."} 
      bgImage={mode === "login" ? "/images/photo_5994565660274527448_x.jpg" : "/images/photo_5994565660274527449_x.jpg"}
    >
      <div className="w-full">
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
