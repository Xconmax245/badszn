"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, CheckCircle2, X, Info } from "lucide-react"

export type NotificationType = "success" | "error" | "info" | "warning"

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type: NotificationType
}

export function NotificationModal({ isOpen, onClose, title, message, type }: NotificationModalProps) {
  const Icon = type === "success" ? CheckCircle2 : 
               type === "error" ? AlertCircle :
               type === "warning" ? AlertCircle : Info

  const colorClass = type === "success" ? "text-emerald-500" :
                     type === "error" ? "text-red-500" :
                     type === "warning" ? "text-amber-500" : "text-blue-500"

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-black border border-white/10 rounded-[3rem] p-12 relative overflow-hidden shadow-2xl shadow-white/5"
          >
            {/* Background Glow */}
            <div className={`absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[120px] opacity-20 ${
              type === "success" ? "bg-emerald-500" : 
              type === "warning" ? "bg-amber-500" :
              "bg-red-500"
            }`} />

            <button 
              onClick={onClose}
              className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className={`w-24 h-24 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mb-10 ${colorClass} shadow-2xl`}>
                <Icon className="w-12 h-12" />
              </div>

              <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-white mb-6 leading-none">
                {title}
              </h2>
              
              <p className="text-[15px] text-white/40 font-medium leading-relaxed tracking-tight max-w-sm mx-auto">
                {message}
              </p>

              <button
                onClick={onClose}
                className="mt-10 w-full py-5 rounded-3xl bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
