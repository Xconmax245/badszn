"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, X } from "lucide-react"

interface ValidationModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
}

export default function ValidationModal({ isOpen, onClose, message }: ValidationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] cursor-pointer"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-10 pointer-events-auto relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
            >
              {/* Technical Aura Background */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-white/5 blur-[80px] rounded-full -z-10" />

              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 mb-2">
                  <AlertCircle size={32} />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Protocol_Conflict</h3>
                  <h2 className="text-xl font-black uppercase tracking-tight text-white leading-tight">
                    Information Required
                  </h2>
                  <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                    {message}
                  </p>
                </div>

                {/* Action */}
                <button
                  onClick={onClose}
                  className="w-full mt-4 bg-white text-black py-5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white/90 transition-all active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                >
                  Return to Terminal
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
