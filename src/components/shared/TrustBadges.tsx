import React from 'react'
import { ShieldCheck, Truck, Clock, CreditCard } from 'lucide-react'

interface TrustBadgeProps {
  icon: React.ElementType
  label: string
  sublabel?: string
  className?: string
}

function TrustBadge({ icon: Icon, label, sublabel, className = "" }: TrustBadgeProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/40 flex-shrink-0">
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{label}</span>
        {sublabel && <span className="text-[9px] font-bold uppercase tracking-wider text-white/20 mt-0.5">{sublabel}</span>}
      </div>
    </div>
  )
}

export function TrustBadges({ variant = "horizontal" }: { variant?: "horizontal" | "vertical" | "grid" }) {
  const badges = [
    { icon: ShieldCheck, label: "Secure Checkout", sublabel: "SSL Encrypted" },
    { icon: Truck,       label: "Global Shipping", sublabel: "Tracked Delivery" },
    { icon: Clock,       label: "Fast Processing", sublabel: "Within 24 Hours" },
    { icon: CreditCard,  label: "Payment Options", sublabel: "Secure Gateway" },
  ]

  if (variant === "grid") {
    return (
      <div className="grid grid-cols-2 gap-6">
        {badges.map((badge, i) => (
          <TrustBadge key={i} {...badge} />
        ))}
      </div>
    )
  }

  return (
    <div className={`flex ${variant === "vertical" ? "flex-col" : "flex-row"} gap-8`}>
      {badges.map((badge, i) => (
        <TrustBadge key={i} {...badge} />
      ))}
    </div>
  )
}
