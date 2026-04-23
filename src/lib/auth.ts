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

export async function getOrCreateCustomer() {
  const user = await getServerUser()
  if (!user) return null

  const { prisma } = await import("@/lib/prisma")
  
  let customer = await prisma.customer.findUnique({
    where: { supabaseUid: user.id },
  })

  if (!customer) {
    try {
      customer = await prisma.customer.create({
        data: {
          supabaseUid: user.id,
          email: user.email!,
          firstName: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || "Member",
          lastName: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ')[1] || "",
          username: user.user_metadata?.username || `user_${user.id.substring(0, 8)}`,
        }
      })
    } catch (e) {
      console.error("Auto-provision error:", e)
      return null
    }
  }

  return customer
}
