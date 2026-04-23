import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return NextResponse.json({ addresses: [] })

  const customer = await prisma.customer.findUnique({
    where: { supabaseUid: session.user.id },
  })

  if (!customer) return NextResponse.json({ addresses: [] })

  const addresses = await prisma.address.findMany({
    where: { customerId: customer.id },
    orderBy: { isDefault: "desc" },
  })

  return NextResponse.json({ addresses })
}

export async function POST(req: Request) {
  const body = await req.json()

  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const customer = await prisma.customer.findUnique({
    where: { supabaseUid: session.user.id },
  })

  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 })
  }

  // Handle default address logic
  if (body.isDefault) {
    await prisma.address.updateMany({
      where: { customerId: customer.id },
      data: { isDefault: false },
    })
  }

  const address = await prisma.address.create({
    data: {
      customerId: customer.id,
      ...body,
    },
  })

  return NextResponse.json({ address })
}
