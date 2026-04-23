import { prisma } from "@/lib/prisma"
import { getServerUser } from "@/lib/auth"
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
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-24 space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-white/20" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Member Profile</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-[-0.05em] leading-none">
            ACCOUNT
          </h1>
          
          <div className="max-w-xl">
            <p className="text-xs md:text-sm text-white/30 uppercase tracking-[0.2em] font-medium leading-relaxed">
              Personalize your presence within the archive. Update your contact details and account preferences below.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="p-1 md:p-0">
              <ProfileForm initialData={serializeData(customer) as any} />
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 space-y-16">
            <div className="border border-white/5 p-10 bg-white/[0.01] space-y-10">
              <div className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Account Status</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-xs font-bold text-white/40">
                    {customer.firstName[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/80 uppercase tracking-widest">{customer.firstName} {customer.lastName}</p>
                    <p className="text-[9px] text-white/20 uppercase tracking-[0.2em]">Verified Member</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Membership</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.3em] text-white/15 mb-2">Loyalty Tier</p>
                    <p className="text-xs font-bold text-white/70 uppercase tracking-widest">{customer.loyaltyTier}</p>
                  </div>
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.3em] text-white/15 mb-2">Joined Date</p>
                    <p className="text-xs font-bold text-white/70 uppercase tracking-widest">
                      {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <form action="/api/auth/signout" method="post">
                  <button type="submit" className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all duration-300">
                    <span>Sign Out</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
