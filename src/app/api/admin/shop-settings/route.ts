import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminRequest } from '@/lib/auth/admin'

export async function GET() {
  try {
    const settings = await prisma.shopSettings.findUnique({ where: { id: 'singleton' } })
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdminRequest(req)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    // Remove id and updatedAt if present to prevent prisma errors
    const { id, updatedAt, ...updateData } = body
    
    const updated = await prisma.shopSettings.upsert({
      where: { id: 'singleton' },
      update: updateData,
      create: { id: 'singleton', ...updateData },
    })
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating shop settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
