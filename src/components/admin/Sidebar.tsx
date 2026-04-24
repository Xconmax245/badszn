"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  Users, 
  Image as ImageIcon, 
  MessageSquare, 
  Tag, 
  Clock, 
  Settings,
  LogOut
} from "lucide-react"

import { useUIStore } from "@/stores/uiStore"
import { AnimatePresence } from "framer-motion"

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Collections", href: "/admin/collections", icon: Layers },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Lookbook", href: "/admin/lookbook", icon: ImageIcon },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { label: "Discounts", href: "/admin/discounts", icon: Tag },
  { label: "Waitlist", href: "/admin/waitlist", icon: Clock },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { isSidebarOpen, setSidebarOpen } = useUIStore()

  const handleLogout = async () => {
    await fetch("/api/auth/signout", { method: "POST" })
    window.location.href = "/admin/login"
  }

  const SidebarContent = (
    <aside 
      className="fixed left-0 top-0 h-screen w-[260px] glass-aura border-r border-white/5 flex flex-col z-[60] shadow-2xl"
    >
      {/* Logo Area */}
      <div className="h-24 flex items-center px-10">
        <Link href="/admin" className="text-xl font-black tracking-tighter text-white select-none text-aura-glow">
          BAD SZN
        </Link>
      </div>

      {/* Nav Section */}
      <nav 
        className="flex-1 py-8 px-6 space-y-1 overflow-y-auto custom-scrollbar"
        data-lenis-prevent
      >
        <div className="px-4 mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Archive Registry</p>
        </div>
        
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
                group flex items-center gap-3.5 px-4 py-3 rounded-lg text-[12px] font-bold tracking-[0.1em] uppercase
                transition-all duration-300 relative
                ${isActive ? "text-white bg-white/[0.1]" : "text-white/50 hover:text-white/80 hover:bg-white/[0.03]"}
              `}
              data-cursor="hover"
              data-magnetic
            >
              {/* Active Indicator */}
              {isActive && (
                <motion.div 
                   layoutId="sidebar-active"
                   className="absolute left-0 top-2 bottom-2 w-[2px] bg-white rounded-full"
                   transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              
              <item.icon className={`w-4 h-4 transition-colors duration-300 ${isActive ? "text-white" : "text-white/20 group-hover:text-white/50"}`} />
              <span className="mt-[0.5px]">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Profile/Footer Area */}
      <div className="p-8 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-white hover:bg-white/[0.05] transition-all duration-300"
          data-cursor="hover"
          data-magnetic
        >
          <LogOut className="w-4 h-4 text-white/20" />
          <span>Commit Sign_Out</span>
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop (Direct into Grid column) */}
      <div className="hidden lg:block">
        {SidebarContent}
      </div>

      {/* Mobile Drawer (State-driven) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] lg:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-[110] lg:hidden"
            >
              <div className="w-[260px] h-full shadow-2xl">
                {SidebarContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
