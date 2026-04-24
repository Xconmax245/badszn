"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, User, CreditCard, ShoppingBag, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(`/api/admin/customers?q=${query}`)
        const data = await res.json()
        setCustomers(data.customers || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchCustomers, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Identity Registry</h1>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em]">Centralized User Insight Pipeline</p>
          </div>
          
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH_IDENTIFIER..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-8 text-[11px] font-black uppercase tracking-widest text-white placeholder:text-white/10 focus:border-white/40 focus:bg-white/[0.05] transition-all outline-none"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-white/10 animate-spin" />
            </div>
          ) : customers.length === 0 ? (
            <div className="py-20 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-white/20">
              <User size={32} strokeWidth={1} className="mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">No matching records found</p>
            </div>
          ) : (
            customers.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:scale-110 transition-transform">
                      <User size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">{c.name}</h3>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">{c.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-12">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Total_Spend</p>
                      <div className="flex items-center gap-2">
                        <CreditCard size={12} className="text-emerald-500/60" />
                        <span className="text-sm font-black text-white">₦{c.totalSpend.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Orders</p>
                      <div className="flex items-center gap-2">
                        <ShoppingBag size={12} className="text-blue-500/60" />
                        <span className="text-sm font-black text-white">{c.orderCount}</span>
                      </div>
                    </div>

                    <div className="space-y-1 min-w-[120px]">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Status</p>
                      <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white/60 uppercase tracking-widest">
                        {c.tier}
                      </span>
                    </div>

                    <Link 
                      href={`/admin/customers/${c.id}`}
                      className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                    >
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
