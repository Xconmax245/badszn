import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-24 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">PROFILE</h1>
      <p className="text-white/40 font-mono text-sm tracking-widest uppercase mb-12">Authorized Access Only</p>
      
      <div className="w-full max-w-md space-y-8 border border-white/10 p-12 bg-zinc-950/50 backdrop-blur-xl">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Email Identity</label>
          <p className="text-xl font-medium tracking-tight">{session.user.email}</p>
        </div>
        
        <div className="h-px bg-white/5 w-full" />
        
        <div className="flex flex-col gap-4">
          <button className="w-full py-4 text-xs font-black uppercase tracking-widest bg-white text-black hover:bg-accent-red hover:text-white transition-all duration-500 rounded-sm">
            Edit Vault
          </button>
          
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="w-full py-4 text-xs font-black uppercase tracking-widest border border-white/10 text-white/50 hover:border-accent-red hover:text-accent-red transition-all duration-500 rounded-sm">
              Terminate Session
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
