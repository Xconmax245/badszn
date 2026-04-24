import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const { type, path, metadata } = await req.json()
    
    // Get current user if logged in
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (n) => cookieStore.get(n)?.value } }
    )
    
    const { data: { session } } = await supabase.auth.getSession()
    let customerId = null
    
    if (session?.user?.id) {
      const customer = await prisma.customer.findUnique({
        where: { supabaseUid: session.user.id },
        select: { id: true }
      })
      customerId = customer?.id
    }

    const event = await prisma.eventLog.create({
      data: {
        type,
        path,
        metadata: metadata || {},
        customerId
      }
    })

    return NextResponse.json({ success: true, id: event.id })
  } catch (error) {
    // Fail silently to avoid interrupting user experience
    console.error("[event_tracking] Error:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
