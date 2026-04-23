"use client"

import { useState } from "react"
import { useCartStore } from "@/stores/cartStore"

interface AddToCartButtonProps {
  product: { id: string; name: string; slug: string; images: { url: string }[] }
  selectedVariant: {
    id:       string
    size:     string
    color:    string | null
    price:    number
    stock:    number
  } | null
}

export default function AddToCartButton({
  product,
  selectedVariant,
}: AddToCartButtonProps) {
  const [adding, setAdding] = useState(false)
  const { addItem, openCart } = useCartStore()

  const handleAdd = async () => {
    if (!selectedVariant) return
    if (selectedVariant.stock === 0) return

    setAdding(true)

    // Update local store
    addItem({
      product,
      variant: selectedVariant,
      price: selectedVariant.price,
      quantity: 1,
    })

    // Sync to DB for logged-in users
    await fetch("/api/cart", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity:  1,
      }),
    }).catch(() => {
      // Guest — handled by localStorage persistence in store
    })

    setAdding(false)
    openCart() // Open drawer to show the item was added
  }

  const isOutOfStock = selectedVariant?.stock === 0
  const isNoVariant  = !selectedVariant

  return (
    <button
      onClick={handleAdd}
      disabled={adding || isOutOfStock || isNoVariant}
      className="
        w-full py-4 rounded-full
        border border-white/20
        text-[12px] font-black tracking-[0.2em] uppercase
        text-white
        hover:bg-white hover:text-black hover:border-white
        disabled:opacity-30 disabled:cursor-not-allowed
        transition-all duration-300
        active:scale-[0.98]
      "
    >
      {adding        ? "Adding..."
      : isOutOfStock ? "Sold Out"
      : isNoVariant  ? "Select a Size"
      : "Add to Cart"}
    </button>
  )
}
