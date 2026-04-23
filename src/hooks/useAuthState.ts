"use client"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

type AuthUser = {
  id:        string
  email:     string
  firstName?: string
}

type AuthState = {
  isAuthenticated: boolean
  loading:         boolean
  user:            AuthUser | null
}

export function useAuthState(): AuthState {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading]                 = useState(true)
  const [user, setUser]                       = useState<AuthUser | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    // Get initial session
    supabase.auth.getSession().then(({ data }: { data: { session: any } }) => {
      const session = data.session
      setIsAuthenticated(!!session)
      setUser(session ? {
        id:        session.user.id,
        email:     session.user.email ?? "",
        firstName: session.user.user_metadata?.first_name
      } : null)
      setLoading(false)
    })
 
    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: any, session: any) => {
        setIsAuthenticated(!!session)
        setUser(session ? {
          id:        session.user.id,
          email:     session.user.email ?? "",
          firstName: session.user.user_metadata?.first_name
        } : null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { isAuthenticated, loading, user }
}
