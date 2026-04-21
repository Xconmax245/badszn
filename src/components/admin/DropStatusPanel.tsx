"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Users, Package, ArrowRight, Activity, Loader2 } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"

export default function DropStatusPanel() {
  const { data, isLoading } = useSWR("/api/admin/dashboard", fetcher, {
    refreshInterval: 60000
  })

  const dropData = data?.dropStatus
  const [timeLeft, setTimeLeft] = useState("00d 00h 00m 00s")

  useEffect(() => {
    if (!dropData?.launchDate) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const target = new Date(dropData.launchDate).getTime()
      const distance = target - now

      if (distance < 0) {
        setTimeLeft("CAMPAIGN LIVE")
        clearInterval(timer)
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(
        `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [dropData?.launchDate])

  if (isLoading) {
    return (
      <div className="bg-[#111111] border border-white/[0.05] rounded-3xl p-10 h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/10 animate-spin" />
      </div>
    )
  }

  if (!dropData) {
    return (
      <div className="bg-[#111111] border border-white/[0.05] rounded-3xl p-10 h-full flex flex-col items-center justify-center text-center">
        <Activity className="w-10 h-10 text-white/5 mb-4" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/20">No Active Campaigns</h3>
        <Link href="/admin/collections/new" className="mt-6 text-[11px] font-bold uppercase tracking-widest text-white underline decoration-white/20 underline-offset-4 hover:text-accent-red hover:decoration-accent-red transition-all">
          Initiate New Drop
        </Link>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden bg-[#111111] border border-white/[0.05] rounded-3xl p-8 md:p-10 h-full flex flex-col justify-between group hover:border-white/10 transition-all duration-500">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/[0.02] blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-white/[0.04] transition-colors" />
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.05] border border-white/10 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">ACTIVE_RECORDS</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 italic">Global Campaign</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-[-0.05em] text-white leading-none">
            {dropData.name}
          </h2>
          
          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center gap-2 text-white/40">
              <Package className="w-4 h-4 text-white/20" />
              <span className="text-[11px] font-bold uppercase tracking-wider">{dropData.productCount} Products</span>
            </div>
            <div className="flex items-center gap-2 text-white/40">
              <Users className="w-4 h-4 text-white/20" />
              <span className="text-[11px] font-bold uppercase tracking-wider">{dropData.waitlistCount} In Waitlist</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end md:text-right space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Launch Sequence</p>
          <div className="font-mono text-3xl md:text-4xl font-black text-white tracking-tight bg-white/[0.03] px-6 py-4 rounded-2xl border border-white/[0.05] min-w-[280px] text-center">
            {timeLeft}
          </div>
          <div className="flex items-center gap-2 text-white/50 text-[10px] uppercase font-bold tracking-widest">
            <Calendar className="w-3.5 h-3.5" />
            <span>Target: {new Date(dropData.launchDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-12 flex flex-col sm:flex-row gap-4">
        <Link 
          href={`/admin/collections/${dropData.slug}`} 
          className="flex-1 bg-white text-black py-4 px-8 rounded-full flex items-center justify-center gap-3 font-black uppercase text-xs tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          data-cursor="hover"
        >
          Manage Drop <ArrowRight className="w-4 h-4" />
        </Link>
        <button 
          className="flex-1 bg-white/5 border border-white/[0.1] text-white py-4 px-8 rounded-full flex items-center justify-center gap-3 font-black uppercase text-xs tracking-[0.2em] hover:bg-white/10 transition-all duration-300"
          data-cursor="hover"
        >
          <Activity className="w-4 h-4 text-white/20" /> Performance
        </button>
      </div>

      {/* Decorative Binary/Code Stubs */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-[0.02] text-[8px] font-mono whitespace-nowrap pointer-events-none select-none">
        BUILD.{dropData.buildId} // STATUS_ACTIVE // SYNC_LOCK_TRUE // SYSTEM_TERMINAL_HQ
      </div>
    </div>
  )
}
