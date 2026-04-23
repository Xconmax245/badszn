import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/auth"

/**
 * Account Dashboard / Profile Gateway
 * This serves as the root for /account
 * Since middleware protects this entire group, we can safely assume 
 * we'll either be here with a session or be redirected to /login.
 */
export default async function AccountPage() {
  const user = await getServerUser()

  // This is a double-check backup to the middleware
  if (!user) {
    redirect("/auth")
  }

  // Temporary redirect to profile until we build the dashboard
  redirect("/account/profile")
}
