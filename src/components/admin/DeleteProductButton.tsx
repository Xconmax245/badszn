"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function DeleteProductButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 3000) // Reset after 3 seconds
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE"
      })
      
      if (!res.ok) throw new Error("Delete failed")
      
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Failed to delete product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`p-2.5 rounded-full border transition-all flex items-center justify-center ${
        confirm 
          ? "bg-red-500 border-red-500 text-white animate-pulse" 
          : "bg-white/[0.03] border-white/10 text-white/20 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/5"
      }`}
      title={confirm ? "Click again to confirm" : "Delete Product"}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  )
}
