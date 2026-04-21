"use client"

import { ReactLenis } from "lenis/react"
import { ReactNode, useEffect, useState } from "react"

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <>{children}</>

  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.08, 
        duration: 1.8, 
        smoothWheel: true,
        wheelMultiplier: 1.1,
        touchMultiplier: 1.5,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  )
}
