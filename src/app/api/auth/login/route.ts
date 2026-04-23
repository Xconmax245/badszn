import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log("Login Attempt:", email)

    // 1. Initialize Supabase Server Client
    const supabase = createServerClient()

    // 2. Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login Error:", error.message)
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    console.log("Login Success:", data.user?.email)
    return NextResponse.json({ 
      success: true, 
      user: data.user,
      session: data.session 
    })

  } catch (error: any) {
    console.error("CRITICAL Login API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error during authentication." },
      { status: 500 }
    )
  }
}
