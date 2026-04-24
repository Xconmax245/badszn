"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] cursor-pointer"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="w-full max-w-sm bg-white text-black rounded-3xl p-10 pointer-events-auto relative shadow-2xl"
            >
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-black/20 hover:text-black transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-black tracking-tight leading-tight">
                    Information Required
                  </h2>
                  <p className="text-sm font-medium text-black/40 leading-relaxed px-4">
                    {message}
                  </p>
                </div>

                {/* Action */}
                <button
                  onClick={onClose}
                  className="w-full mt-4 bg-black text-white py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black/90 transition-all active:scale-95"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
