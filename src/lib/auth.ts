import { createServerClient } from "@/lib/supabase/server"

export async function getServerSession() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getServerUser() {
  const session = await getServerSession()
  return session?.user ?? null
}
