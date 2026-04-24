"use client"

import { useVisitorTracking } from "@/hooks/useVisitorTracking"
import { useTrackPageView } from "@/lib/events"

export default function VisitorTracker() {
  useVisitorTracking()
  useTrackPageView()
  return null
}
