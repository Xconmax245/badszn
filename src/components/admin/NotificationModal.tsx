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
            className="w-full max-w-md bg-black border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl shadow-white/5"
          >
            {/* Background Glow */}
            <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-20 ${
              type === "success" ? "bg-emerald-500" : 
              type === "warning" ? "bg-amber-500" :
              "bg-red-500"
            }`} />

            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className={`w-20 h-20 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mb-8 ${colorClass} shadow-2xl`}>
                <Icon className="w-10 h-10" />
              </div>

              <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white mb-4 leading-tight">
                {title}
              </h2>
              
              <p className="text-[14px] text-white/50 font-medium leading-relaxed tracking-tight max-w-[280px]">
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
