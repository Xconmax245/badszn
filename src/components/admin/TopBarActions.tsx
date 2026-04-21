"use client"

import { Search, Bell } from "lucide-react"

export default function TopBarActions() {
  return (
    <div className="flex items-center gap-10">
      {/* Search */}
      <div className="relative group hidden lg:block">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
        <input 
          type="text" 
          placeholder="Search Intelligence..." 
          className="h-12 md:max-w-[200px] lg:max-w-none w-80 bg-white/[0.03] border border-white/10 rounded-full pl-12 pr-6 text-[12px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all tracking-wider"
        />
      </div>

      <div className="flex items-center gap-10">
        <button className="relative p-3 text-white/30 hover:text-white transition-colors rounded-full hover:bg-white/[0.05]" data-cursor="hover">
          <Bell className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span className="absolute top-3.5 right-3.5 h-2 w-2 rounded-full bg-white border-2 border-black" />
        </button>
      </div>
    </div>
  )
}
