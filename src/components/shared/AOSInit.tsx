'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: 'cubic-bezier(0.23, 1, 0.32, 1)' as any,
      once: false, 
      offset: 120,  
      delay: 50,  
      mirror: true, 
    })
  }, [])

  return null
}
