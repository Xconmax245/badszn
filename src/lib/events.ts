/**
 * Client-side event tracking utility for the BAD SZN Archive Insight pipeline.
 * Captures user behavior (visits, cart actions, checkouts) and logs them to the database.
 */
export async function trackEvent(type: 'VISIT' | 'ADD_TO_CART' | 'CHECKOUT' | 'SEARCH' | 'PRODUCT_VIEW', metadata: any = {}) {
  try {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        path: window.location.pathname,
        metadata,
        timestamp: new Date().toISOString()
      }),
    })
    return await res.json()
  } catch (error) {
    // Silent fail in production to avoid interrupting user flow
    if (process.env.NODE_ENV === 'development') {
      console.error("[event_tracking] Failed:", error)
    }
  }
}

/**
 * React hook for automatic page view tracking
 */
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function useTrackPageView() {
  const pathname = usePathname()

  useEffect(() => {
    // Avoid tracking admin or auth callback routes
    const isPublic = !pathname.startsWith('/admin') && !pathname.startsWith('/auth/callback')
    if (isPublic) {
      trackEvent('VISIT')
    }
  }, [pathname])
}
