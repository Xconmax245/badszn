'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

// ── Types ────────────────────────────────────────────────────────

export interface CustomerProfile {
  id:        string
  email:     string
  firstName: string
  lastName:  string | null
}

interface AuthContextValue {
  user:       User | null
  customer:   CustomerProfile | null
  session:    Session | null
  isLoading:  boolean
  signOut:    () => Promise<void>
}

// ── Context ──────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>({
  user:      null,
  customer:  null,
  session:   null,
  isLoading: true,
  signOut:   async () => {},
})

// ── Provider ─────────────────────────────────────────────────────

interface Props {
  children:        ReactNode
  initialSession:  Session | null   // passed from server layout
}

export function SupabaseProvider({ children, initialSession }: Props) {
  const supabase = getSupabaseBrowserClient()

  const [session,   setSession]   = useState<Session | null>(initialSession)
  const [user,      setUser]      = useState<User | null>(initialSession?.user ?? null)
  const [customer,  setCustomer]  = useState<CustomerProfile | null>(null)
  const [isLoading, setIsLoading] = useState(!initialSession) // if we have initial session, skip loading

  // ── Fetch customer profile ──────────────────────────────────────
  const fetchCustomer = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('customers')
      .select('id, email, first_name, last_name')
      .eq('supabase_uid', userId)
      .single()

    if (!error && data) {
      setCustomer({
        id:        data.id,
        email:     data.email,
        firstName: data.first_name ?? '',
        lastName:  data.last_name ?? null,
      })
    }
  }, [supabase])

  // ── Bootstrap — runs once on mount ─────────────────────────────
  useEffect(() => {
    let mounted = true

    const init = async () => {
      // If we already have initialSession, use it directly
      if (initialSession?.user) {
        await fetchCustomer(initialSession.user.id)
        if (mounted) setIsLoading(false)
        return
      }

      // Otherwise fetch from Supabase
      const { data }: { data: { session: Session | null } } = await supabase.auth.getSession()

      if (!mounted) return

      if (data.session?.user) {
        setSession(data.session)
        setUser(data.session.user)
        await fetchCustomer(data.session.user.id)
      }

      setIsLoading(false)
    }

    init()

    // ── Auth state listener ──────────────────────────────────────
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, newSession: Session | null) => {
        if (!mounted) return

        if (event === 'SIGNED_IN' && newSession?.user) {
          setSession(newSession)
          setUser(newSession.user)
          await fetchCustomer(newSession.user.id)
          setIsLoading(false)
        }

        if (event === 'SIGNED_OUT') {
          setSession(null)
          setUser(null)
          setCustomer(null)
          setIsLoading(false)
        }

        if (event === 'TOKEN_REFRESHED' && newSession) {
          setSession(newSession)
          setUser(newSession.user)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, initialSession, fetchCustomer])

  // ── Sign out ────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    setCustomer(null)
    window.location.href = '/'
  }, [supabase])

  return (
    <AuthContext.Provider value={{ user, customer, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Consumer hook ─────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}
