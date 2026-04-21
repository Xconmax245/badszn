"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

// ── Types ─────────────────────────────────────────────
interface FooterLink { label: string; href: string }
interface FooterLinks {
  shop: FooterLink[]
  company: FooterLink[]
  support: FooterLink[]
  access: FooterLink[]
}

interface FooterClientProps {
  brandMessage: string
  footerLinks: FooterLinks
  instagramUrl: string
  twitterUrl: string
  contactEmail: string
  waitlistEnabled: boolean
  waitlistText: string
}

// ── Easing ─────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const

// ── Single Nav Column ──────────────────────────────────
function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="space-y-6">
      <h3 className="text-[9px] font-black tracking-[0.4em] uppercase text-white/20">
        {title}
      </h3>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.05em] text-white/40 hover:text-white/80 transition-colors duration-300"
            >
              <span className="relative">
                {link.label}
                <span className="absolute bottom-[-1px] left-0 w-0 h-[1px] bg-white/20 group-hover:w-full transition-all duration-400" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Waitlist Input ─────────────────────────────────────
function WaitlistInput({ waitlistText }: { waitlistText: string }) {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || state === "loading") return

    setState("loading")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setState("success")
        setEmail("")
      } else {
        setState("error")
        setTimeout(() => setState("idle"), 3000)
      }
    } catch {
      setState("error")
      setTimeout(() => setState("idle"), 3000)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-[9px] font-black tracking-[0.4em] uppercase text-white/20">
        Early Access
      </h3>
      <p className="text-[11px] font-medium text-white/30 tracking-wide">
        {waitlistText}
      </p>
      <AnimatePresence mode="wait">
        {state === "success" ? (
          <motion.p
            key="success"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/60"
          >
            You're in. We'll be in touch.
          </motion.p>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="flex items-center border-b border-white/10 focus-within:border-white/30 transition-colors duration-300"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="flex-1 bg-transparent py-3 text-[12px] font-medium text-white/60 placeholder:text-white/20 focus:outline-none"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="text-[10px] font-black tracking-[0.2em] uppercase text-white/30 hover:text-white/70 transition-colors duration-300 pl-4 pb-3"
            >
              {state === "loading" ? "..." : "→"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main Footer ────────────────────────────────────────
export default function FooterClient({
  brandMessage,
  footerLinks,
  instagramUrl,
  twitterUrl,
  contactEmail,
  waitlistEnabled,
  waitlistText,
}: FooterClientProps) {
  const socialLinks = [
    instagramUrl && { label: "Instagram", href: instagramUrl },
    twitterUrl && { label: "Twitter", href: twitterUrl },
    contactEmail && { label: "Email", href: `mailto:${contactEmail}` },
  ].filter(Boolean) as { label: string; href: string }[]

  return (
    <footer className="relative w-full bg-[#000] border-t border-white/[0.05] overflow-hidden">

      {/* ── Grain texture (matches Hero) ──────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          opacity: 0.06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />

      {/* ── Main grid ─────────────────────────────────── */}
      <div className="relative z-10 px-6 md:px-12 lg:px-16 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16">

          {/* Brand Block — col span 1 */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <Link
                href="/"
                className="block text-[13px] font-black tracking-[0.3em] uppercase text-white hover:text-white/80 transition-colors duration-300"
              >
                BAD SZN
              </Link>
              <p className="mt-3 text-[11px] font-medium tracking-[0.05em] text-white/30 leading-relaxed max-w-[180px]">
                {brandMessage}
              </p>
            </div>
          </div>

          {/* Nav Columns — col span 3 */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-10">
            <FooterColumn title="Shop" links={footerLinks.shop} />
            <FooterColumn title="Company" links={footerLinks.company} />
            <FooterColumn title="Support" links={footerLinks.support} />
            <FooterColumn title="Access" links={footerLinks.access} />
          </div>

          {/* Waitlist — col span 1 */}
          {waitlistEnabled && (
            <div className="lg:col-span-1">
              <WaitlistInput waitlistText={waitlistText} />
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Strip ──────────────────────────────── */}
      <div className="relative z-10 px-6 md:px-12 lg:px-16 py-8 border-t border-white/[0.04] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-[10px] font-medium tracking-[0.15em] text-white/15 uppercase">
          © {new Date().getFullYear()} BAD SZN. All rights reserved.
        </p>

        {socialLinks.length > 0 && (
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/20 hover:text-white/50 transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  )
}
