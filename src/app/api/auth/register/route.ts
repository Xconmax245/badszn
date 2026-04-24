import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, username, redirect = "/" } = await request.json()
    const { origin } = new URL(request.url)

    // 1. Initialize Supabase Server Client
    const supabase = createServerClient()

    // 2. Sign up with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
        data: {
          full_name: `${firstName} ${lastName}`.trim(),
          first_name: firstName,
          last_name: lastName,
        }
      }
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user?.id) {
      return NextResponse.json(
        { error: "Authentication failed to initialize user session." },
        { status: 500 }
      )
    }


    // 3. Create Corresponding Customer in Prisma
    try {
      // Use upsert-like logic to handle pre-existing Prisma records from failed syncs
      await prisma.customer.upsert({
        where: { email },
        update: {
          supabaseUid: authData.user.id,
          firstName,
          lastName,
          username
        },
        create: {
          email,
          firstName,
          lastName,
          username,
          supabaseUid: authData.user.id,
        }
      })
    } catch (dbError: any) {
      console.error("Prisma Customer Sync Error:", {
        message: dbError.message,
        code: dbError.code,
        meta: dbError.meta
      })
      
      // Rollback: Delete the Supabase user if profile sync fails
      try {
        const adminClient = createAdminClient()
        await adminClient.auth.admin.deleteUser(authData.user.id)
      } catch (rollbackErr) {
        console.error("Rollback critical failure:", rollbackErr)
      }

      // Specific error handling for duplicate fields (P2002)
      if (dbError.code === "P2002") {
        const target = dbError.meta?.target || []
        const targetStr = Array.isArray(target) ? target.join(",") : String(target)
        
        if (targetStr.includes("username")) {
          return NextResponse.json({ error: "Identity conflict: @username already claimed." }, { status: 409 })
        }
        if (targetStr.includes("email")) {
          return NextResponse.json({ error: "Identity conflict: email already registered." }, { status: 409 })
        }
      }

      return NextResponse.json(
        { error: `Sync Failed: ${dbError.message || "Entry aborted for security."}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      requiresVerification: true,
      message: "Check your email to confirm your account.",
    })

  } catch (error: any) {
    console.error("Signup API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error during registration." },
      { status: 500 }
    )
  }
}
