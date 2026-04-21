import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Account Dashboard / Profile Gateway
 * This serves as the root for /account
 * Since middleware protects this entire group, we can safely assume 
 * we'll either be here with a session or be redirected to /login.
 */
export default async function AccountPage() {
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

  // This is a double-check backup to the middleware
  if (!session) {
    redirect("/login")
  }

  // Temporary redirect to profile until we build the dashboard
  redirect("/account/profile")
}
