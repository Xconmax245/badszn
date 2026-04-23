"use client"

import { useEffect } from "react"

export function useVisitorTracking() {
  useEffect(() => {
    // We only track in production or if we want to test locally
    // but definitely only on the client side
    if (typeof window === "undefined") return

    let sessionId = localStorage.getItem("visitor_id")

    if (!sessionId) {
      sessionId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 15)
      localStorage.setItem("visitor_id", sessionId)
    }

    // Fire and forget
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    }).catch(err => console.error("Visitor tracking failed:", err))
  }, [])
}
