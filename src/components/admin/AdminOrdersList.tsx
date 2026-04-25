"use client"

import { useState } from "react"
import { OrderStatus } from "@prisma/client"
import { Loader2, Search, Filter } from "lucide-react"

export default function AdminOrdersList({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [loading, setLoading] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("ALL")

  const updateStatus = async (id: string, status: string) => {
    setLoading(id)
    try {
      const res = await fetch("/api/admin/orders/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      })
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status } : o))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(null)
    }
  }

  const filteredOrders = filter === "ALL" 
    ? orders 
    : orders.filter(o => o.status === filter)

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl overflow-x-auto no-scrollbar">
        {["ALL", "PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-all whitespace-nowrap ${
              filter === f ? 'bg-white text-black' : 'text-white/40 hover:text-white/60'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01]">
              <th className="px-6 py-4 text-[12px] font-semibold text-white/30 uppercase tracking-wider">Order</th>
              <th className="px-6 py-4 text-[12px] font-semibold text-white/30 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-[12px] font-semibold text-white/30 uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 text-[12px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[12px] font-semibold text-white/30 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="px-6 py-6">
                  <p className="text-[14px] font-semibold text-white">#{order.orderNumber || order.id.slice(0, 8)}</p>
                  <p className="text-[12px] text-white/30">{new Date(order.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-6">
                  <p className="text-[14px] font-medium text-white">{order.guestEmail || order.customer?.email || 'N/A'}</p>
                </td>
                <td className="px-6 py-6">
                  <p className="text-[14px] font-semibold text-white">₦{Number(order.total).toLocaleString()}</p>
                </td>
                <td className="px-6 py-6">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold ${
                    order.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' :
                    order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-white/10 text-white/40'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex justify-end items-center gap-3">
                    {loading === order.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white/20" />
                    ) : (
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="bg-black border border-white/10 rounded-xl px-3 py-1.5 text-[12px] font-semibold text-white outline-none focus:border-white/20 transition-all cursor-pointer"
                      >
                        <option value="PAID">Paid</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
