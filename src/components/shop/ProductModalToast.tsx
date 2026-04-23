'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'

interface Props {
  visible: boolean
  message: string
  onDismiss: () => void
}

export function ProductModalToast({ visible, message, onDismiss }: Props) {
  // Auto-dismiss after 2500ms
  useEffect(() => {
    if (!visible) return
    const t = setTimeout(onDismiss, 2500)
    return () => clearTimeout(t)
  }, [visible, onDismiss])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="
            absolute bottom-6 left-1/2 -translate-x-1/2 z-[100]
            flex items-center gap-3
            px-5 py-3 rounded-full
            bg-white text-black shadow-2xl
            pointer-events-none
          "
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: 8,  scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Icon */}
          <span className="w-5 h-5 rounded-full bg-black flex items-center justify-center shrink-0 text-white">
            <Check size={12} strokeWidth={3} />
          </span>
          {/* Message */}
          <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
