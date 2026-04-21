"use client"

import { useUIStore } from "@/stores/uiStore"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function MobileNavToggle() {
  const { isSidebarOpen, toggleSidebar } = useUIStore()

  return (
    <button 
      onClick={toggleSidebar}
      className="lg:hidden p-3 -ml-3 text-white/40 hover:text-white transition-all rounded-full hover:bg-white/[0.05]"
      data-cursor="hover"
      data-magnetic
      aria-label="Toggle Navigation"
    >
      <AnimatePresence mode="wait">
        {isSidebarOpen ? (
          <motion.div
            key="close"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <X className="w-6 h-6" />
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Menu className="w-6 h-6" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
