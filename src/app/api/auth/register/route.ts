import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, username } = await request.json()

    // 1. Initialize Supabase Server Client
    const supabase = createServerClient()

    // 2. Sign up with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
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

    // 2.5 Auto-Confirm User via Admin Client
    try {
      const adminClient = createAdminClient()
      const { error: confirmError } = await adminClient.auth.admin.updateUserById(
        authData.user.id,
        { email_confirm: true }
      )
      if (confirmError) console.error("Auto-confirm error:", confirmError)
    } catch (adminErr) {
      console.error("Admin Client Initialization Error:", adminErr)
    }

    // 3. Create Corresponding Customer in Prisma
    try {
      await prisma.customer.create({
        data: {
          email,
          firstName,
          lastName,
          username,
          supabaseUid: authData.user.id,
        }
      })
    } catch (dbError: any) {
      console.error("Prisma Customer Sync Error:", dbError)
      
      // Rollback: Delete the Supabase user if profile sync fails
      try {
        const adminClient = createAdminClient()
        await adminClient.auth.admin.deleteUser(authData.user.id)
      } catch (rollbackErr) {
        console.error("Rollback critical failure:", rollbackErr)
      }

      // Specific error handling for duplicate fields
      if (dbError.code === "P2002") {
        const target = dbError.meta?.target || []
        if (target.includes("username")) {
          return NextResponse.json({ error: "Identity conflict: @username already claimed." }, { status: 409 })
        }
        if (target.includes("email")) {
          return NextResponse.json({ error: "Identity conflict: email already registered in database." }, { status: 409 })
        }
      }

      return NextResponse.json(
        { error: "System Sync Failed. Entry aborted for security." },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      user: authData.user,
      session: authData.session 
    })

  } catch (error: any) {
    console.error("Signup API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error during registration." },
      { status: 500 }
    )
  }
}
