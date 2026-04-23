import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createServerClient } from "@/lib/supabase/server"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const customer = await prisma.customer.findUnique({
    where: { supabaseUid: user.id },
  })

  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 })
  }

  // Verify ownership
  const existing = await prisma.address.findUnique({
    where: { id },
  })

  if (!existing || existing.customerId !== customer.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const { isDefault, ...otherFields } = body

  // If setting as default, unset all others first
  if (isDefault) {
    await prisma.address.updateMany({
      where: { customerId: customer.id },
      data: { isDefault: false },
    })
  }

  const address = await prisma.address.update({
    where: { id },
    data: {
      ...otherFields,
      isDefault: isDefault !== undefined ? !!isDefault : existing.isDefault,
    },
  })

  return NextResponse.json(address)
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const customer = await prisma.customer.findUnique({
    where: { supabaseUid: user.id },
  })

  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 })
  }

  // Verify ownership
  const existing = await prisma.address.findUnique({
    where: { id },
  })

  if (!existing || existing.customerId !== customer.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.address.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
