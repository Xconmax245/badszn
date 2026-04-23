import { getServerUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function SettingsPage() {
  const user = await getServerUser()
  if (!user) redirect("/auth")

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-white/20" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Preferences</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-[-0.04em] leading-none">
            SETTINGS
          </h1>
          <p className="text-xs md:text-sm text-white/30 uppercase tracking-[0.2em] font-medium max-w-xl leading-relaxed">
            Manage your account preferences, notification settings and security.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="border border-white/5 p-12 bg-white/[0.01] flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
              <span className="text-white/20 text-2xl">...</span>
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Coming Soon</h3>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] max-w-xs">
              Additional preference settings will be available in the next collection update.
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Security</h3>
              <button className="w-full text-left py-6 border-b border-white/5 flex items-center justify-between group">
                <span className="text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Change Password</span>
                <span className="text-white/10 group-hover:text-white/30 transition-colors">→</span>
              </button>
              <button className="w-full text-left py-6 border-b border-white/5 flex items-center justify-between group">
                <span className="text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Two-Factor Authentication</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-white/30 px-2 py-1 border border-white/10">Inactive</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
