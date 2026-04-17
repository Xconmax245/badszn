'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: false, // Whether animation should happen only once - while scrolling down
      offset: 50,  // Offset (in px) from the original trigger point
      delay: 100,  // Values from 0 to 3000, with step 50ms
      mirror: true, // Whether elements should animate out while scrolling past them
    })
  }, [])

  return null
}
