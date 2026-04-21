import { create } from 'zustand'

export type CursorVariant = 'default' | 'hover' | 'product' | 'drag' | 'hidden'

interface UIStore {
  cursorVariant: CursorVariant
  setCursor: (variant: CursorVariant) => void
  isSidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  cursorVariant: 'default',
  setCursor: (variant) => set({ cursorVariant: variant }),
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}))
