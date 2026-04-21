import { getAdminSession, getRoleDisplay } from "@/lib/auth/admin"
import TopBarActions from "./TopBarActions"
import MobileNavToggle from "./MobileNavToggle"
import { User } from "lucide-react"

interface TopBarProps {
  title: string
}

export default async function AdminTopbar({ title }: TopBarProps) {
  const session = await getAdminSession()

  return (
    <header 
      className="sticky top-0 z-40 flex h-24 w-full items-center justify-between border-b border-white/5 glass-aura px-6 md:px-12 box-border shadow-2xl"
    >
      {/* Left: Functional Controls */}
      <div className="flex items-center gap-4">
        <MobileNavToggle />
      </div>

      {/* Right: Personal & Universal Actions */}
      <div className="flex items-center gap-6">
        <div className="hidden xl:block">
          <TopBarActions />
        </div>
        
        <div className="hidden md:block h-8 w-[1px] bg-white/5" />

        <div className="flex items-center gap-4 group cursor-pointer" data-cursor="hover">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[11px] font-black text-white uppercase tracking-widest leading-none">
              {session?.name ? session.name.split(' ')[0] : "Admin"}
            </span>
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1.5">
              {session ? getRoleDisplay(session.role) : "Lvl_00"}
            </span>
          </div>
          <div className="h-10 w-10 md:h-11 md:w-11 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center transition-all group-hover:border-white/30">
            <User className="w-4 h-4 md:w-5 md:h-5 text-white/20 transition-colors group-hover:text-white" />
          </div>
        </div>
      </div>
    </header>
  )
}
