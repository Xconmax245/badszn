"use client"

import { useState } from "react"
import { Truck, CheckCircle2, ChevronDown, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface StatusUpdateActionProps {
  orderId: string
  currentStatus: string
}

export function StatusUpdateAction({ orderId, currentStatus }: StatusUpdateActionProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const updateStatus = async (newStatus: string) => {
    if (loading) return
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error("Failed to update status")

      toast.success(`Order marked as ${newStatus}`)
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error("Status update failed")
    } finally {
      setLoading(false)
    }
  }

  if (currentStatus === "DELIVERED") {
    return (
      <div className="flex items-center gap-2 px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500">
        <CheckCircle2 className="w-4 h-4" />
        <span className="text-[11px] font-black uppercase tracking-widest">Order Completed</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {currentStatus === "CONFIRMED" && (
        <button
          onClick={() => updateStatus("SHIPPED")}
          disabled={loading}
          className="px-8 py-4 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/90 transition-all flex items-center gap-3 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
          Mark as Shipped
        </button>
      )}

      {currentStatus === "SHIPPED" && (
        <button
          onClick={() => updateStatus("DELIVERED")}
          disabled={loading}
          className="px-8 py-4 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all flex items-center gap-3 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          Mark as Delivered
        </button>
      )}
    </div>
  )
}
