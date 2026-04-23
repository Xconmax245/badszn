import { prisma } from "@/lib/prisma"
import { BarChart3, Database, Globe, CreditCard, ShieldCheck, Cpu } from "lucide-react"
import SiteConfigForm from "@/components/admin/SiteConfigForm"
import { ShopControlPanel } from "@/components/admin/ShopControlPanel"

export default async function AdminSettingsPage() {
  const config = await prisma.siteConfig.findUnique({
    where: { id: "singleton" }
  })

  return (
    <div className="min-h-screen space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-32">
      {/* ─── SYSTEM HEADER ────────────────────────────────────── */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-white/5 pb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-12 bg-white/40" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Control Terminal</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-[-0.04em] text-white uppercase leading-none">
            Settings
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/20 max-w-lg leading-relaxed">
            Global operational parameters and system-wide overrides for the archive.
          </p>
        </div>
        
        <div className="flex items-center gap-12 bg-white/[0.02] border border-white/5 p-8 rounded-sm">
          <div className="space-y-2">
            <span className="text-[9px] font-black text-white/10 uppercase tracking-widest block">Runtime Environment</span>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[11px] font-black text-white/60 uppercase tracking-widest">Node {process.version}</span>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="space-y-2">
            <span className="text-[9px] font-black text-white/10 uppercase tracking-widest block">Security Level</span>
            <span className="text-[11px] font-black text-white/60 uppercase tracking-widest">Root_Access_01</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-16">
        {/* ─── MAIN CONTROLS (LEFT) ───────────────────────────── */}
        <div className="col-span-12 xl:col-span-8 space-y-24">
          
          {/* Shop Control Panel (Master Control) */}
          <section className="relative">
            <div className="absolute -top-12 -left-12 opacity-5 pointer-events-none">
               <Cpu size={120} />
            </div>
            <div className="p-12 md:p-16 bg-[#0D0D0D] border border-white/10 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <ShopControlPanel />
            </div>
          </section>

          {/* Site Config Form (Brand & Content) */}
          <section className="space-y-12">
            <div className="flex items-center gap-4">
               <div className="h-[1px] w-12 bg-white/10" />
               <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 text-center">Identity_Configuration</h2>
            </div>
            <SiteConfigForm initialData={config} />
          </section>
        </div>

        {/* ─── SYSTEM TELEMETRY (RIGHT) ────────────────────────── */}
        <div className="col-span-12 xl:col-span-4 space-y-12">
           <div className="sticky top-12 space-y-12">
             <div className="p-12 bg-white/[0.01] border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 text-white/[0.02] group-hover:text-white/[0.05] transition-colors duration-700">
                  <BarChart3 size={80} />
                </div>

                <h3 className="text-[11px] font-black tracking-[0.3em] text-white/40 flex items-center gap-4 mb-12 uppercase">
                  <Activity className="w-4 h-4" /> System_Health
                </h3>
                
                <div className="space-y-10">
                  <HealthItem 
                    label="Database Status" 
                    value="Synchronized" 
                    status="active" 
                    icon={<Database size={14} />} 
                  />
                  <HealthItem 
                    label="Media Storage" 
                    value="Cloudinary Production" 
                    status="idle" 
                    icon={<Globe size={14} />} 
                  />
                  <HealthItem 
                    label="Payment Engine" 
                    value="Paystack Direct" 
                    status="idle" 
                    icon={<CreditCard size={14} />} 
                  />
                  <HealthItem 
                    label="Admin Access" 
                    value="Restricted Level 01" 
                    status="restricted" 
                    icon={<ShieldCheck size={14} />} 
                  />
                </div>

                {/* Status Bar */}
                <div className="mt-16 pt-10 border-t border-white/5 flex items-center justify-between">
                   <div className="flex gap-1">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className={`h-3 w-1 ${i < 6 ? 'bg-emerald-500/40' : 'bg-white/5'}`} />
                      ))}
                   </div>
                   <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">Operational Stability: 98.4%</span>
                </div>
             </div>

             <div className="p-10 border border-dashed border-white/10 flex flex-col items-center text-center space-y-6">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/10 leading-relaxed max-w-[200px]">
                  System caution: Configuration changes persist globally. All overrides are audited.
                </p>
                <div className="flex items-center gap-4 opacity-20">
                   <div className="h-px w-8 bg-white" />
                   <div className="w-1.5 h-1.5 rounded-full bg-white" />
                   <div className="h-px w-8 bg-white" />
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}

function HealthItem({ label, value, status, icon }: { label: string; value: string; status: 'active' | 'idle' | 'restricted'; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between group/item">
      <div className="flex items-center gap-4">
        <div className="text-white/10 group-hover/item:text-white/30 transition-colors duration-500">
          {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{label}</span>
      </div>
      <div className="text-right space-y-1">
        <span className={`text-[10px] font-black uppercase tracking-widest block ${status === 'active' ? 'text-emerald-500' : status === 'restricted' ? 'text-white/40' : 'text-white/70'}`}>
          {value}
        </span>
        {status === 'active' && (
          <div className="flex justify-end">
            <div className="h-[1px] w-8 bg-emerald-500/30" />
          </div>
        )}
      </div>
    </div>
  )
}
