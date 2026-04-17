'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useUIStore, type CursorVariant } from '@/stores/uiStore'

export default function CustomCursor() {
  const cursorVariant = useUIStore((s) => s.cursorVariant)
  const setCursor = useUIStore((s) => s.setCursor)
  const [isMounted, setIsMounted] = useState(false)
  const currentVariantRef = useRef(cursorVariant)

  // Keep ref in sync
  useEffect(() => {
    currentVariantRef.current = cursorVariant
  }, [cursorVariant])

  // Motion values for smooth tracking
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Spring configs for a snappier, more responsive feel
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 }
  const ringX = useSpring(mouseX, springConfig)
  const ringY = useSpring(mouseY, springConfig)

  // Check if touch device - hide cursor
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)

      // Attribute-based detection for robustness
      const target = e.target as HTMLElement;
      const cursorTarget = target?.closest('[data-cursor]') as HTMLElement;
      const variant = cursorTarget?.getAttribute('data-cursor') as CursorVariant;

      // Auto-hide over inputs/textareas
      const isInput = target?.tagName === 'INPUT' 
        || target?.tagName === 'TEXTAREA' 
        || target?.isContentEditable;
      
      let nextVariant: CursorVariant = 'default';
      
      if (isInput) {
        nextVariant = 'hidden';
      } else if (variant) {
        nextVariant = variant;
      }
      
      if (currentVariantRef.current !== nextVariant) {
        setCursor(nextVariant);
      }
    }

    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia('(hover: none)').matches)
    }

    checkTouch()
    window.addEventListener('mousemove', move)
    window.addEventListener('resize', checkTouch)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('resize', checkTouch)
    }
  }, [mouseX, mouseY])

  if (!isMounted || isTouchDevice) return null

  const variants = {
    default: {
      width: 40,
      height: 40,
      backgroundColor: 'transparent',
      border: '1.5px solid rgba(255, 255, 255, 0.4)',
    },
    hover: {
      width: 64,
      height: 64,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1.5px solid rgba(255, 255, 255, 0.8)',
    },
    product: {
      width: 100,
      height: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    drag: {
      width: 100,
      height: 100,
      backgroundColor: '#ffffff',
      border: 'none',
    },
    hidden: {
      width: 0,
      height: 0,
      opacity: 0,
    }
  }

  return (
    <>
      {/* ── Outer Ring (Elastic/Spring) ────────────────── */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center will-change-transform"
        style={{ 
          x: ringX, 
          y: ringY, 
          translateX: '-50%', 
          translateY: '-50%',
        }}
        animate={cursorVariant}
        variants={variants}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* ── Inner Dot (Instant Follow) ─────────────────── */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[10000] will-change-transform"
        style={{ 
          x: mouseX, 
          y: mouseY, 
          translateX: '-50%', 
          translateY: '-50%' 
        }}
        animate={{
          scale: cursorVariant === 'hidden' ? 0 : 1,
          opacity: cursorVariant === 'hidden' ? 0 : 1
        }}
      />
    </>
  )
}
