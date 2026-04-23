"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { 
  Plus, 
  ShoppingBag, 
  Users, 
  Package, 
  AlertCircle,
  TrendingUp,
  ExternalLink,
  ShieldCheck
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import ActivityFeed from "@/components/admin/ActivityFeed"
import DropStatusPanel from "@/components/admin/DropStatusPanel"
import { GrowthBadge } from "@/components/admin/GrowthBadge"
import { LastUpdated } from "@/components/admin/LastUpdated"
import { formatNaira } from "@/lib/utils/formatCurrency"
import { useEffect } from "react"

interface DashboardData {
  revenue: { total: number; today: number; growth: number }
  orders: { total: number; today: number; pending: number; growth: number }
  customers: { total: number; newToday: number; retention: number }
  visitors: { total: number; today: number; returning: number }
  inventory: { status: string; critical: number; low: number }
  fetchedAt: string
  activity?: any[]
  dropStatus?: any
  lowStock?: any[]
  version?: string
}

type MetricCardProps = {
  label:    string
  value:    string
  growth:   number | null
  status?:  "healthy" | "low" | "critical"
  sub:      string
  delay:    number
}

function MetricCard({ label, value, growth, status, sub, delay }: MetricCardProps) {
  const Icon = label.includes("Orders") ? ShoppingBag : 
               label.includes("Revenue") ? TrendingUp :
               label.includes("Visitors") || label.includes("Visits") ? ExternalLink :
               label.includes("Customers") ? Users : Package

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: delay * 0.001, ease: [0.22, 1, 0.36, 1] }}
      className="p-6 md:p-8 glass-aura glass-aura-hover rounded-[2rem] group transition-all duration-700 relative overflow-hidden"
      data-cursor="hover"
    >
      <div className="flex items-center justify-between mb-8">
        <div className={`w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all text-white/30 group-hover:text-white`}>
          <Icon className="w-4 h-4" />
        </div>
        {growth !== null && <GrowthBadge value={growth} />}
      </div>
      
      <div className="relative z-10">
        <p className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-white text-aura-glow whitespace-nowrap overflow-hidden text-ellipsis">
          {value}
        </p>
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">
            {label}
          </p>
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest truncate">
            {sub}
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  )
}

function MetricCardSkeleton() {
  return (
    <div className="p-8 glass-aura rounded-[2rem] animate-pulse">
      <div className="w-10 h-10 rounded-full bg-white/5 mb-8" />
      <div className="h-10 w-32 bg-white/5 rounded mb-4" />
      <div className="h-3 w-20 bg-white/5 rounded mb-2" />
      <div className="h-2 w-24 bg-white/5 rounded opacity-50" />
    </div>
  )
}

function deriveMetrics(data: DashboardData | null): MetricCardProps[] {
  return [
    {
      label:  "Revenue Today",
      value:  data ? formatNaira(data.revenue.today) : "—",
      growth: data?.revenue.growth ?? null,
      sub:    data ? `${formatNaira(data.revenue.total)} total` : "System standby",
      delay:  0
    },
    {
      label:  "Orders Today",
      value:  data ? String(data.orders.today) : "—",
      growth: data?.orders.growth ?? null,
      sub:    data ? `${data.orders.pending} pending push` : "Registry waiting",
      delay:  100
    },
    {
      label:  "Customers",
      value:  data ? String(data.customers.total) : "—",
      growth: null,
      sub:    data ? `${data.customers.newToday} new · ${data.customers.retention}% sync` : "Audience offline",
      delay:  200
    },
    {
      label:  "Inventory",
      value:  data?.inventory.status ?? "—",
      growth: null,
      status: data ? (data.inventory.status.toLowerCase() as MetricCardProps["status"]) : undefined,
      sub:    data ? `${data.inventory.critical} critical · ${data.inventory.low} low` : "Stock unverified",
      delay:  300
    },
    {
      label:  "Total Visits",
      value:  data ? String(data.visitors.total) : "—",
      growth: null,
      sub:    data ? `${data.visitors.today} today · ${data.visitors.returning} returning` : "Traffic offline",
      delay:  400
    },
    {
      label:  "Audience Flow",
      value:  data ? `${Math.round((data.visitors.returning / (data.visitors.total || 1)) * 100)}%` : "—",
      growth: null,
      sub:    "Returning visitor ratio",
      delay:  500
    },
  ]
}

export default function AdminDashboard() {
  const { data: statsData, error: statsError, isLoading: statsLoading, isValidating: statsValidating } = useSWR<DashboardData>("/api/admin/dashboard", fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
    shouldRetryOnError: true,
    errorRetryCount: 5
  })

  useEffect(() => {
    if (statsError?.status === 401) {
      window.location.href = "/admin/login"
    }
  }, [statsError])

  const metrics = deriveMetrics(statsData ?? null)

  return (
    <div className="space-y-16">
      {/* ─── HEADER & STATUS ─────────────────────────────────── */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <ShieldCheck className={`w-5 h-5 ${statsError ? "text-red-500" : "text-emerald-500"}`} />
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/50">
            {statsError ? "Registry_Status: SYNC_LATENCY" : "Registry_Status: NOMINAL"}
          </h2>
        </div>
        <div className="flex items-center gap-6">
           {statsData && <LastUpdated timestamp={new Date(statsData.fetchedAt)} />}
        </div>
      </motion.div>

      {/* ─── METRICS STRIP ───────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <AnimatePresence>
          {statsError && !statsData && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 px-2"
            >
              <div className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-amber-500/60">
                Database_Connection_Failure: Re-trying_Synchronization...
              </span>
            </motion.div>
          )}

          {!statsError && statsValidating && statsData && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 px-2"
            >
              <div className="h-2 w-2 rounded-full bg-white/20 animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/20">
                Refreshing_Telemetry...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6">
          {statsLoading && !statsData ? (
             Array.from({ length: 4 }).map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))
          ) : (
            metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))
          )}
        </div>
      </div>

      {/* ─── DROP STATUS & QUICK ACTIONS ────────────────────── */}
      <div className="grid grid-cols-12 gap-10">
        <motion.div 
          className="col-span-12 xl:col-span-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <DropStatusPanel />
        </motion.div>
        
        <motion.div 
          className="col-span-12 xl:col-span-4 space-y-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-6 px-2">Operational_Quick_Links</h3>
            <div className="grid grid-cols-1 gap-4">
              <Link 
                href="/admin/products/new"
                className="flex items-center justify-between p-6 glass-aura glass-aura-hover rounded-2xl group transition-all"
                data-cursor="hover"
                data-magnetic
              >
                <div className="flex items-center gap-5">
                   <div className="w-11 h-11 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/20 group-hover:text-white transition-all">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-white tracking-widest uppercase">Registry_Entry</p>
                    <p className="text-[9px] text-white/30 uppercase mt-1 font-bold tracking-[0.2em]">Inventory_Push</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-white/10 group-hover:text-white transition-all" />
              </Link>

              <Link 
                href="/admin/collections/new"
                className="flex items-center justify-between p-6 glass-aura glass-aura-hover rounded-2xl group transition-all"
                data-cursor="hover"
                data-magnetic
              >
                <div className="flex items-center gap-5">
                  <div className="w-11 h-11 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/20 group-hover:text-white transition-all">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-white tracking-widest uppercase">Archive_Stream</p>
                    <p className="text-[9px] text-white/30 uppercase mt-1 font-bold tracking-[0.2em]">Drop_Orchestration</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-white/10 group-hover:text-white transition-all" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── ACTIVITY FEED & ALERTS ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <motion.div 
          className="lg:col-span-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <ActivityFeed />
        </motion.div>
        
        <motion.div 
          className="lg:col-span-4 space-y-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="p-10 glass-aura rounded-[2.5rem] relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
                <h3 className="text-[11px] font-black tracking-[0.3em] text-white uppercase leading-none mt-0.5">Priority_Alerts</h3>
              </div>
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none">V.1.4.0</span>
            </div>
            
            <div className="space-y-10">
               {(!statsData || statsData.lowStock?.length === 0) && (
                 <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] text-center py-4">Signals_Nominal</p>
               )}
               {statsData?.lowStock?.slice(0, 3).map((v: any, i: number) => (
                 <Link 
                   key={i} 
                   href="/admin/products" 
                   className="flex gap-6 group hover:bg-white/[0.02] p-2 -mx-2 rounded-xl transition-all"
                   data-cursor="hover"
                   data-magnetic
                 >
                   <div className="flex-shrink-0 w-11 h-11 rounded-full bg-red-500/5 flex items-center justify-center text-red-500 border border-red-500/10 transition-colors group-hover:bg-red-500 group-hover:text-white">
                     <AlertCircle className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-[12px] font-black text-white leading-tight uppercase tracking-wider">{v.status}_Signal</p>
                     <p className="text-[10px] text-white/50 mt-2 font-black leading-relaxed tracking-widest uppercase">
                       {v.productName} ({v.size}) depleted [{v.stock}_UNIT]
                     </p>
                   </div>
                 </Link>
               ))}
            </div>

            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />
          </div>

          <div className="p-8 glass-aura rounded-3xl" data-magnetic>
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-500/40" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 leading-none">Operational_Intelligence</span>
            </div>
            {statsData ? (
              <p className="text-[13px] font-medium text-white/40 leading-relaxed uppercase tracking-wider italic">
                Registry synchronization is <span className="text-white font-black not-italic text-aura-glow">NOMINAL</span>. Statically verified telemetry streaming from <span className="text-white font-black not-italic text-aura-glow">HQ-PRIMARY</span>.
              </p>
            ) : (
               <div className="h-10 bg-white/5 rounded animate-pulse" />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
