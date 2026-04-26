"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { NotificationModal, NotificationType } from "./NotificationModal"

export function DeleteProductButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)
  
  // Modal State
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info" as NotificationType
  })

  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 3000)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE"
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || "Delete failed")
      
      if (data.mode === "archived") {
        setModal({
          isOpen: true,
          title: "Product Archived",
          message: data.message,
          type: "warning"
        })
      } else {
        setModal({
          isOpen: true,
          title: "Deleted",
          message: "Product has been completely removed from the registry.",
          type: "success"
        })
      }

      router.refresh()
    } catch (err: any) {
      console.error(err)
      setModal({
        isOpen: true,
        title: "Deletion Failed",
        message: err.message || "An unexpected error occurred during the request.",
        type: "error"
      })
    } finally {
      setLoading(false)
      setConfirm(false)
    }
  }

  return (
    <>
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

      <NotificationModal 
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </>
  )
}
