import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)

  const code     = searchParams.get("code")
  const redirect = searchParams.get("redirect") ?? "/"

  // No code in URL — link is malformed or already used
  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth?error=invalid_link`
    )
  }

  try {
    const supabase = createServerClient()

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("[callback] code exchange failed:", error.message)
      // Link expired or already used
      return NextResponse.redirect(
        `${origin}/auth?error=expired_link`
      )
    }

    // Success — redirect to success page with original destination
    return NextResponse.redirect(
      `${origin}/auth/success?redirect=${encodeURIComponent(redirect)}`
    )

  } catch (err) {
    console.error("[callback] unexpected error:", err)
    return NextResponse.redirect(
      `${origin}/auth?error=unexpected`
    )
  }
}
