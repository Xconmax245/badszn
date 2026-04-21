"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"

export function LastUpdated({ timestamp }: { timestamp: Date }) {
  const [label, setLabel] = useState("")

  useEffect(() => {
    const update = () => setLabel(
      formatDistanceToNow(timestamp, { addSuffix: true })
    )
    update()
    const interval = setInterval(update, 10_000)
    return () => clearInterval(interval)
  }, [timestamp])

  return (
    <span className="text-[9px] text-white/20 tracking-widest uppercase font-bold">
      Synchronized {label}
    </span>
  )
}
