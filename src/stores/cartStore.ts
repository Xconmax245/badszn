import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id:         string
  productId:  string
  variantId:  string
  name:       string
  slug:       string
  image:      string
  price:      number
  size:       string
  color?:     string | null
  quantity:   number
  shippingCost: number // ✅ NEW
}

export interface CouponState {
  id:             string
  code:           string
  type:           'PERCENTAGE' | 'FLAT' | 'FREE_SHIPPING' | null
  value:          number
  discountAmount: number
  isValid:        boolean
}


interface CartStore {
  items:      CartItem[]
  isOpen:     boolean
  coupon:     CouponState | null

  // Drawer
  openCart:    () => void
  closeCart:   () => void
  toggleCart:  () => void

  // Items
  addItem:    (payload: {
    product:  { id: string; name: string; slug: string; images: { url: string }[]; shippingCost: number }
    variant:  { id: string; size: string; color?: string | null; stock: number }
    price:    number
    quantity: number
    shippingCost: number // ✅ NEW
  }) => void
  removeItem: (variantId: string) => void
  updateQty:  (variantId: string, quantity: number) => void
  clearCart:   () => void

  // Coupon
  applyCoupon:  (coupon: CouponState) => void
  removeCoupon: () => void

  // Computed
  itemCount:      () => number
  subtotal:       () => number
  discountAmount: () => number
  shipping:       () => number
  total:          () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items:  [],
      isOpen: false,
      coupon: null,

      openCart:   () => set({ isOpen: true }),
      closeCart:  () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: ({ product, variant, price, quantity, shippingCost }) => {
        set(state => {
          const existing = state.items.find(i => i.variantId === variant.id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.variantId === variant.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                id:        typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
                productId: product.id,
                variantId: variant.id,
                name:      product.name,
                slug:      product.slug,
                image:     product.images[0]?.url ?? '',
                price,
                size:      variant.size,
                color:     variant.color ?? null,
                quantity,
                shippingCost: shippingCost ?? 0, // ✅ NEW
              },
            ],
          }
        })
      },

      removeItem: (variantId) =>
        set(state => ({ items: state.items.filter(i => i.variantId !== variantId) })),

      updateQty: (variantId, quantity) =>
        set(state => ({
          items: quantity <= 0
            ? state.items.filter(i => i.variantId !== variantId)
            : state.items.map(i =>
                i.variantId === variantId ? { ...i, quantity } : i
              ),
        })),

      clearCart:     () => set({ items: [], coupon: null }),
      applyCoupon:   (coupon) => set({ coupon }),
      removeCoupon:  () => set({ coupon: null }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      discountAmount: () => {
        const { coupon } = get()
        if (!coupon?.isValid) return 0
        const sub = get().subtotal()
        if (coupon.type === 'PERCENTAGE') return Math.round(sub * (coupon.value / 100))
        if (coupon.type === 'FLAT') return Math.min(coupon.value, sub)
        return 0
      },

      shipping: () => {
        const { coupon, items } = get()
        if (coupon?.isValid && coupon.type === 'FREE_SHIPPING') return 0
        
        // Sum of all individual item shipping costs
        return items.reduce((sum, i) => sum + (i.shippingCost || 0) * i.quantity, 0)
      },

      total: () => {
        const sub      = get().subtotal()
        const discount = get().discountAmount()
        const ship     = get().shipping()
        return Math.max(0, sub - discount + ship)
      },
    }),
    {
      name: 'badszn-cart',
      partialize: (s) => ({ items: s.items, coupon: s.coupon }),
    }
  )
)
