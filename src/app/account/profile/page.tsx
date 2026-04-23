import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/account/ProfileForm"
import { serializeData } from "@/lib/utils/serialize"

export default async function ProfilePage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth")
  }

  const customer = await prisma.customer.findUnique({
    where: { supabaseUid: session.user.id }
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
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-accent-red" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-red">Security Protocol v1.0</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-[-0.04em] leading-none">
            PROFILE<span className="text-white/10">_</span>
          </h1>
          <p className="text-xs md:text-sm text-white/30 uppercase tracking-[0.3em] font-medium max-w-xl leading-relaxed">
            Manage your digital identity and atmospheric preferences. All data is encrypted and authorized for access only by the account owner.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8">
            <ProfileForm initialData={serializeData(customer) as any} />
          </div>

          <div className="lg:col-span-4 space-y-12">
            <div className="border border-white/5 p-8 bg-white/[0.02] space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Session Status</h3>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">Authorized Identity</span>
              </div>
              <p className="text-[10px] text-white/20 uppercase tracking-widest leading-relaxed">
                Your session is secured with end-to-end encryption. Multiple active sessions may degrade performance.
              </p>
              
              <div className="pt-4">
                <form action="/api/auth/signout" method="post">
                  <button type="submit" className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-red hover:text-white transition-colors duration-300">
                    Terminate Session →
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Account Metadata</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-white/5 p-4">
                  <p className="text-[8px] uppercase tracking-widest text-white/20 mb-1">Tier</p>
                  <p className="text-xs font-bold text-white/60 uppercase tracking-widest">{customer.loyaltyTier}</p>
                </div>
                <div className="border border-white/5 p-4">
                  <p className="text-[8px] uppercase tracking-widest text-white/20 mb-1">Created</p>
                  <p className="text-xs font-bold text-white/60 uppercase tracking-widest">
                    {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
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
