"use client"

import { useState } from "react"
import { useCartStore } from "@/stores/cartStore"
import { Loader2 } from "lucide-react"

interface PaymentButtonProps {
  form: any
}

export default function PaymentButton({ form }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const { items, subtotal } = useCartStore()
  
  const handleCheckout = async () => {
    if (items.length === 0) return
    
    // Validation
    if (!form.fullName || !form.email || !form.line1 || !form.city) {
      alert("Please complete the shipping address first")
      return
    }

    setLoading(true)

    try {
      // 1. Create Order and Init Paystack in one go
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            size: item.size,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.image
          })),
          subtotal: subtotal(),
          total: subtotal(),
          shippingAddress: form,
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Checkout failed")

      // 2. Redirect to Paystack
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("Payment URL not found")
      }
    } catch (error: any) {
      console.error("Checkout failed:", error)
      alert(error.message || "Payment initialization failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || items.length === 0}
      className="w-full bg-white text-black py-6 rounded-full text-[13px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(255,255,255,0.15)]"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing...
        </>
      ) : (
        "INITIALIZE PAYMENT"
      )}
    </button>
  )
}
