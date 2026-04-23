'use client'
import { useState } from 'react'
import { X } from 'lucide-react'

export function ShopAnnouncement({ text }: { text: string }) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <div className="bg-brand-ink text-white/60 py-2.5 px-6
                    flex items-center justify-between">
      <span className="font-body text-xs tracking-label text-center flex-1">{text}</span>
      <button onClick={() => setDismissed(true)} className="text-white/30 hover:text-white/60">
        <X size={12} strokeWidth={1.5} />
      </button>
    </div>
  )
}
