import { createServerClient } from "@/lib/supabase/server"

export async function getServerSession() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getServerUser() {
  const supabase = createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}
