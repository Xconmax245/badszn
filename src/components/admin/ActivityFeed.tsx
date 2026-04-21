"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  RefreshCw, 
  ShoppingBag, 
  UserPlus, 
  Box, 
  MessageSquare,
  Clock,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { formatDistanceToNow } from "date-fns"

type ActivityType = "order" | "customer" | "product" | "review"

interface ActivityItem {
  id: string
  type: ActivityType
  message: string
  createdAt: string
  meta: any
}

export default function ActivityFeed() {
  const { data, mutate, isLoading, isValidating } = useSWR("/api/admin/dashboard", fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true
  })

  // Animation pulse on refresh
  const [pulse, setPulse] = useState(false)
  
  useEffect(() => {
    if (isValidating && !isLoading) {
      setPulse(true)
      const timer = setTimeout(() => setPulse(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isValidating, isLoading])

  const activities: ActivityItem[] = data?.activity || []

  const getIcon = (type: ActivityType) => {
    switch (type) {
      case "order": return <ShoppingBag className="w-4 h-4" />
      case "customer": return <UserPlus className="w-4 h-4" />
      case "product": return <Box className="w-4 h-4" />
      case "review": return <MessageSquare className="w-4 h-4" />
      default: return <Box className="w-4 h-4" />
    }
  }

  const getColors = (type: ActivityType) => {
    switch (type) {
      case "order": return "text-white bg-white/[0.05] border-white/10"
      case "customer": return "text-white/60 bg-white/[0.03] border-white/5"
      case "product": return "text-red-500 bg-red-500/5 border-red-500/10"
      case "review": return "text-emerald-500 bg-emerald-500/5 border-emerald-500/10"
      default: return "text-white bg-white/[0.05] border-white/10"
    }
  }

  return (
    <div className={`bg-black border rounded-[2rem] overflow-hidden flex flex-col h-full min-h-[550px] shadow-2xl transition-all duration-1000 ${pulse ? "border-white/30" : "border-white/10"} hover:border-white/20`}>
      {/* Header */}
      <div className="px-10 py-10 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-white mb-1">Activity Stream</h3>
          <div className="flex items-center gap-3">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest">Live Operations</p>
          </div>
        </div>

        <button 
          onClick={() => mutate()}
          disabled={isValidating}
          className="p-3 rounded-full bg-white/[0.03] border border-white/10 text-white/30 hover:text-white hover:bg-white/[0.08] transition-all disabled:opacity-50 group"
          data-cursor="hover"
        >
          <RefreshCw className={`w-4 h-4 ${isValidating ? "animate-spin" : "transition-transform group-hover:rotate-180 duration-500"}`} />
        </button>
      </div>

      {/* List */}
      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-6 animate-pulse">
                <div className="w-11 h-11 rounded-full bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-white/5 rounded w-3/4" />
                  <div className="h-2 bg-white/5 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-10 py-20">
             <Clock className="w-12 h-12 mb-4" />
             <p className="text-[11px] font-bold uppercase tracking-widest text-center px-10">Waiting for system signals</p>
          </div>
        ) : (
          <div className="space-y-1">
            <AnimatePresence initial={false}>
              {activities.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group flex items-center gap-6 p-6 rounded-2xl transition-all duration-300 hover:bg-white/[0.02]"
                  data-cursor="hover"
                >
                  <div className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 ${getColors(item.type)}`}>
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-white/90 leading-snug group-hover:text-white transition-colors">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-3 h-3 text-white/10" />
                      <span className="text-[10px] font-bold text-white/15 uppercase tracking-widest whitespace-nowrap">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-white/20" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-8 border-t border-white/10 bg-white/[0.01]">
        <Link 
          href="/admin/activity" 
          className="flex items-center justify-center gap-3 py-3 rounded-xl border border-white/5 text-[11px] font-bold uppercase tracking-widest text-white/20 hover:text-white hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300"
          data-cursor="hover"
        >
          <span>Intelligence Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
