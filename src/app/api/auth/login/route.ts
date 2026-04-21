import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // 1. Initialize Supabase Server Client
    const supabase = createServerClient()

    // 2. Sign in with Supabase
    // The @supabase/ssr library handles the session cookies automatically via our server.ts implementation
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      user: data.user,
      session: data.session 
    })

  } catch (error: any) {
    console.error("Login API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error during authentication." },
      { status: 500 }
    )
  }
}
