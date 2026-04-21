import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    // 1. Sign out from Supabase (clears auth cookies managed by @supabase/ssr)
    const supabase = createServerClient()
    await supabase.auth.signOut()

    // 2. Manually clear the Admin JWT cookie
    const cookieStore = cookies()
    cookieStore.delete("admin_token")

    // 3. Redirect to home page or login
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error("Signout API Error:", error)
    return NextResponse.json(
      { error: "Error during signout." },
      { status: 500 }
    )
  }
}
