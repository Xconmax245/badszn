"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  ShoppingBag, 
  CreditCard, 
  Clock, 
  Activity, 
  ShoppingCart,
  User,
  ExternalLink,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function CustomerDetailPage() {
  const params = useParams()
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`/api/admin/customers/${params.id}`)
        const data = await res.json()
        setCustomer(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomer()
  }, [params.id])

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-white/10 animate-spin" />
    </div>
  )

  if (!customer) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-6">
      <p className="text-white/40 text-[10px] uppercase tracking-widest">Customer Not Found</p>
      <Link href="/admin/customers" className="text-white text-xs underline">Return to Directory</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        <header className="flex items-center justify-between">
          <Link 
            href="/admin/customers"
            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Customer Directory
          </Link>
          <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">UID: {customer.id}</p>
          </div>
        </header>

        {/* Profile Header */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
          <div className="space-y-8">
            <div className="flex items-end gap-8">
              <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                <User size={48} strokeWidth={1} />
              </div>
              <div className="space-y-2">
                <h1 className="text-6xl font-black text-white uppercase tracking-tighter">{customer.firstName} {customer.lastName}</h1>
                <p className="text-xl font-bold text-white/40 uppercase tracking-tight">{customer.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Total Spend</p>
                <p className="text-2xl font-black text-white">₦{Number(customer.totalSpend).toLocaleString()}</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Orders</p>
                <p className="text-2xl font-black text-white">{customer.orders.length}</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Loyalty Tier</p>
                <p className="text-2xl font-black text-emerald-500">{customer.loyaltyTier}</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Joined Date</p>
                <p className="text-lg font-black text-white/60">{new Date(customer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 px-2 flex items-center gap-3">
              <Activity size={12} />
              Current Cart
            </h3>
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 min-h-[200px]">
              {customer.cartSession?.items.length > 0 ? (
                <div className="space-y-4">
                  {customer.cartSession.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="text-[11px] font-black text-white uppercase tracking-tight">
                        {item.product.name} ({item.quantity})
                      </div>
                      <Link href={`/product/${item.product.slug}`} target="_blank">
                        <ExternalLink size={12} className="text-white/20" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/10 space-y-2 pt-8">
                  <ShoppingCart size={24} strokeWidth={1} />
                  <p className="text-[9px] font-black uppercase tracking-widest">Cart is empty</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Tabs/Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Order History */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 px-2 flex items-center gap-3">
              <ShoppingBag size={12} />
              Order History
            </h3>
            <div className="space-y-4">
              {customer.orders.map((order: any) => (
                <div key={order.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-white uppercase tracking-widest">#{order.orderNumber}</p>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm font-black text-white">₦{Number(order.total).toLocaleString()}</p>
                      <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{order.status}</p>
                    </div>
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-white group-hover:text-black transition-all"
                    >
                      <ArrowLeft size={16} className="rotate-180" />
                    </Link>
                  </div>
                </div>
              ))}
              {customer.orders.length === 0 && (
                <p className="text-[10px] font-black text-white/10 uppercase tracking-widest p-12 border border-dashed border-white/5 rounded-3xl text-center">Zero transactions found</p>
              )}
            </div>
          </div>

          {/* Activity Logs */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 px-2 flex items-center gap-3">
              <Clock size={12} />
              Activity Log
            </h3>
            <div className="space-y-4 font-mono">
              {customer.eventLogs.map((log: any) => (
                <div key={log.id} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      log.type === 'CHECKOUT' ? 'bg-emerald-500' : 
                      log.type === 'ADD_TO_CART' ? 'bg-blue-500' : 'bg-white/20'
                    }`} />
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-wider">{log.type}</span>
                    <span className="text-[10px] text-white/20 truncate max-w-[200px]">{log.path}</span>
                  </div>
                  <span className="text-[9px] text-white/10">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
              {customer.eventLogs.length === 0 && (
                <p className="text-[10px] font-black text-white/10 uppercase tracking-widest p-12 border border-dashed border-white/5 rounded-3xl text-center">No telemetry recorded</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
