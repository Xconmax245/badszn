import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/account/ProfileForm"
import { serializeData } from "@/lib/utils/serialize"

export default async function ProfilePage() {
  const user = await getServerUser()

  if (!user) {
    redirect("/auth")
  }

  const customer = await prisma.customer.findUnique({
    where: { supabaseUid: user.id }
  })

  if (!customer) {
    // This should theoretically not happen if signup sync worked
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-black uppercase tracking-tighter">Identity Not Found</h1>
          <p className="text-white/40 text-xs uppercase tracking-widest">Please contact support or try re-logging.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white pt-32 pb-20 px-6 md:px-12 lg:px-24 overflow-hidden">
      
      {/* Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.02] z-0">
        <h2 className="text-[40vw] font-black leading-none tracking-tighter">ID</h2>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-24 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-accent-red" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-red">Identity Core v1.2</span>
            </div>
            <div className="px-3 py-1 border border-green-500/20 bg-green-500/5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-green-500/80">Authorized</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-[-0.05em] leading-none">
            PROFILE<span className="text-white/10">_</span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            <p className="text-xs md:text-sm text-white/25 uppercase tracking-[0.25em] font-medium leading-relaxed">
              Managing your digital identity within the BAD SZN ecosystem. All modifications are synchronized across the global atmosphere.
            </p>
            <div className="flex md:justify-end">
              <div className="text-right hidden md:block">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 mb-1">Access Token</p>
                <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{customer.id.substring(0, 16)}...</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="p-1 md:p-0">
              <ProfileForm initialData={serializeData(customer) as any} />
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 space-y-16">
            <div className="relative group border border-white/5 p-10 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-700">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
              </div>
              
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-8">Session Integrity</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-xs font-black text-white/40">
                    {customer.firstName[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/80 uppercase tracking-widest">{customer.firstName} {customer.lastName}</p>
                    <p className="text-[9px] text-white/20 uppercase tracking-[0.2em]">Verified Identity</p>
                  </div>
                </div>
                
                <p className="text-[10px] text-white/25 uppercase tracking-widest leading-[1.8]">
                  Your session is actively monitored for security. Access from unauthorized nodes will trigger a containment protocol.
                </p>
                
                <div className="pt-6 border-t border-white/5">
                  <form action="/api/auth/signout" method="post">
                    <button type="submit" className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all duration-500">
                      <span>Sign Out</span>
                      <span className="text-accent-red transition-transform duration-500 group-hover:translate-x-2">→</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Registry Data</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-white/5 p-6 bg-white/[0.01]">
                  <p className="text-[8px] uppercase tracking-[0.3em] text-white/15 mb-2">Atmospheric Tier</p>
                  <p className="text-xs font-bold text-white/70 uppercase tracking-widest">{customer.loyaltyTier}</p>
                </div>
                <div className="border border-white/5 p-6 bg-white/[0.01]">
                  <p className="text-[8px] uppercase tracking-[0.3em] text-white/15 mb-2">Registered Since</p>
                  <p className="text-xs font-bold text-white/70 uppercase tracking-widest">
                    {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
