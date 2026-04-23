import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const category    = searchParams.get('category')
  const sizes       = searchParams.get('sizes')?.split(',').filter(Boolean) ?? []
  const sort        = searchParams.get('sort') ?? 'newest'
  const availability = searchParams.get('availability') ?? 'all'
  const search      = searchParams.get('search') ?? ''
  const page        = parseInt(searchParams.get('page') ?? '1')
  const limit       = parseInt(searchParams.get('limit') ?? '12')
  const skip        = (page - 1) * limit

  const where: any = { status: 'ACTIVE' }

  if (category) {
    where.category = { slug: category }
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (availability === 'on_sale') {
    where.compareAtPrice = { not: null }
  }

  if (availability === 'in_stock') {
    where.variants = { some: { stock: { gt: 0 } } }
  }

  if (sizes.length > 0) {
    where.variants = {
      some: {
        size: { in: sizes },
        stock: { gt: 0 },
      },
    }
  }

  const orderBy: any =
    sort === 'price_asc'  ? { basePrice: 'asc' }  :
    sort === 'price_desc' ? { basePrice: 'desc' } :
    sort === 'newest'     ? { createdAt: 'desc' } :
    sort === 'sale'       ? { compareAtPrice: 'desc' } :
    { createdAt: 'desc' }

  try {
    // Sequential fetch to prevent connection pool exhaustion with limit=1
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        images:   { orderBy: { sortOrder: 'asc' } },
        variants: true,
        category: true,
      },
    })
    
    const total = await prisma.product.count({ where })

    return NextResponse.json({ products, total, page, limit })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
