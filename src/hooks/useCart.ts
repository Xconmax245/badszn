import { useCartStore } from "@/stores/cartStore"

/**
 * A simple hook to expose cart state and actions.
 * Encapsulates the Zustand store for cleaner imports and potential logic extensions.
 */
export const useCart = () => {
  const store = useCartStore()

  return {
    items:          store.items,
    isOpen:         store.isOpen,
    coupon:         store.coupon,
    
    // Actions
    openCart:       store.openCart,
    closeCart:      store.closeCart,
    toggleCart:     store.toggleCart,
    addItem:        store.addItem,
    removeItem:     store.removeItem,
    updateQty:      store.updateQty,
    clearCart:      store.clearCart,
    applyCoupon:    store.applyCoupon,
    removeCoupon:   store.removeCoupon,

    // Computed
    itemCount:      store.itemCount(),
    subtotal:       store.subtotal(),
    shipping:       store.shipping(),
    discountAmount: store.discountAmount(),
    total:          store.total(),
  }
}
