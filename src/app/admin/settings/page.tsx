import { prisma } from "@/lib/prisma"
import { BarChart3, Database, Globe, Zap } from "lucide-react"
import SiteConfigForm from "@/components/admin/SiteConfigForm"

export default async function AdminSettingsPage() {
  const config = await prisma.siteConfig.findUnique({
    where: { id: "singleton" }
  })

  return (
    <div className="space-y-16 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Global Settings</h1>
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-white/20">Operational Controls and Brand Configuration</p>
        </div>
        
        <div className="hidden lg:flex items-center gap-6">
          <div className="text-right">
            <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest block mb-1">System Version</span>
            <span className="text-[12px] font-semibold text-white/40 leading-none">v1.4.0 High-Availability</span>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 xl:col-span-8">
           <SiteConfigForm initialData={config} />
        </div>

        <div className="col-span-12 xl:col-span-4 space-y-10">
           <div className="p-10 bg-black border border-white/10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
              <h3 className="text-[11px] font-bold tracking-[0.2em] text-white/20 flex items-center gap-3 mb-10 uppercase">
                <BarChart3 className="w-4 h-4" /> System Health
              </h3>
              
              <div className="space-y-8">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-white/20">Database Status</span>
                  <span className="text-emerald-500 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Synchronized
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest pt-6 border-t border-white/5">
                  <span className="text-white/20">Media Storage</span>
                  <span className="text-white">Cloudinary Production</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest pt-6 border-t border-white/5">
                  <span className="text-white/20">Payment Engine</span>
                  <span className="text-white">Paystack Direct</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest pt-6 border-t border-white/5">
                  <span className="text-white/20">Admin Access</span>
                  <span className="text-white/40">Restricted Level 01</span>
                </div>
              </div>

              {/* Decorative base flourish */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />
           </div>

           <div className="px-10 py-8 bg-white/[0.01] border border-dashed border-white/10 rounded-[2rem]">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/10 leading-relaxed text-center">
                System caution: Configuration changes persist globally. All overrides are audited in the activity stream.
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}
