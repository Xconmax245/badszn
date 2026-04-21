import { createClient } from "@supabase/supabase-js"

/**
 * Creates a Supabase client with the Service Role Key.
 * This client bypasses RLS and can perform administrative tasks 
 * like auto-confirming users. Use with extreme caution on the server only.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
