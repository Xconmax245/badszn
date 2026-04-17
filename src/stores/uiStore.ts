import { create } from 'zustand'

export type CursorVariant = 'default' | 'hover' | 'product' | 'drag' | 'hidden'

interface UIStore {
  cursorVariant: CursorVariant
  setCursor: (variant: CursorVariant) => void
}

export const useUIStore = create<UIStore>((set) => ({
  cursorVariant: 'default',
  setCursor: (variant) => set({ cursorVariant: variant }),
}))
