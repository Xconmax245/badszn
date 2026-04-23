'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User, ChevronDown, LogOut, Package, Heart, Settings } from 'lucide-react'
import { useAuth } from '@/components/providers/SupabaseProvider'

const MENU_ITEMS = [
  { label: 'Identity Profile', href: '/account/profile', icon: User },
  { label: 'My Orders',  href: '/account/orders', icon: Package },
  { label: 'Wishlist',   href: '/account/wishlist', icon: Heart },
  { label: 'Settings',   href: '/account/settings', icon: Settings },
]

export function UserMenu() {
  const { user, customer, isLoading, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef  = useRef<HTMLDivElement>(null)
  const router   = useRouter()

  const firstName =
    (customer?.firstName && customer.firstName.trim() !== '')
      ? customer.firstName
      : (user?.user_metadata?.first_name && String(user.user_metadata.first_name).trim() !== '')
        ? String(user.user_metadata.first_name)
        : user?.email?.split('@')[0] ?? 'You'

  // ── Click outside ───────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  // ── Escape key ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen])

  // ── Loading — render a non-interactive placeholder ────────────────
  if (isLoading) {
    return <div className="w-16 h-4 rounded animate-pulse bg-white/5" />
  }

  // ── Logged out — redirect to /login ─────────────────────────────
  if (!user) {
    return (
      <button
        onClick={() => router.push('/login')}
        aria-label="Sign in"
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all duration-300"
        data-cursor="hover"
      >
        <User size={18} strokeWidth={1.5} />
      </button>
    )
  }

  // ── Logged in ────────────────────────────────────────────────────
  return (
    <div ref={menuRef} className="relative">
      {/* Trigger — "Hi, Tunde" */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className={`
          flex items-center gap-3 px-4 py-2 rounded-full
          bg-white/[0.03] border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isOpen ? 'border-white/20 bg-white/[0.08]' : 'border-white/[0.06] hover:border-white/10 hover:bg-white/[0.05]'}
        `}
        data-cursor="hover"
      >
        <div className="w-5 h-5 rounded-full bg-accent-red flex items-center justify-center text-[10px] font-black text-white uppercase">
          {firstName[0]}
        </div>
        <span className="text-xs font-bold tracking-widest uppercase text-white/80">
          Hi, {firstName}
        </span>
        <ChevronDown 
          size={14} 
          className={`text-white/30 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="
              absolute top-full right-0 mt-3
              w-64 overflow-hidden
              bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl
              shadow-[0_20px_50px_rgba(0,0,0,0.5)]
              z-50
            "
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5">
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black mb-1">Authenticated</p>
              <p className="text-sm text-white font-bold truncate">{user.email}</p>
            </div>

            {/* Menu items */}
            <div className="p-2">
              {MENU_ITEMS.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="
                    flex items-center gap-3 px-3 py-2.5
                    rounded-xl text-white/60 hover:text-white hover:bg-white/5
                    transition-all duration-200
                  "
                >
                  <item.icon size={16} className="opacity-40" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/5 mx-2" />

            {/* Sign out */}
            <div className="p-2">
              <button
                onClick={async () => {
                  setIsOpen(false)
                  await signOut()
                }}
                className="
                  flex items-center gap-3 w-full px-3 py-2.5
                  rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5
                  transition-all duration-200
                "
              >
                <LogOut size={16} className="opacity-60" />
                <span className="text-[11px] font-bold uppercase tracking-widest">
                  Sign Out
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
