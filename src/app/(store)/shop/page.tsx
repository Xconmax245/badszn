import { prisma } from '@/lib/prisma'
import { ShopPage } from '@/components/shop/ShopPage'
import { ShopClosedGate } from '@/components/shop/ShopClosedGate'
import { Metadata } from 'next'
import { serializeData } from '@/lib/utils/serialize'

export const revalidate = 60 // ISR — revalidate every 60s

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SHOP / BAD SZN — Built different. Worn louder.',
    description: 'Archive collection of premium atmospheric streetwear. BAD SZN — Built different. Worn louder.',
  }
}
export default async function ShopPageRoute() {
  // Fetch data with defensive fallback
  let initialProductsData = []
  let total = 0
  let settings = null
  
  try {
    settings = await prisma.shopSettings.findUnique({ where: { id: 'singleton' } })
    
    initialProductsData = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      take: 12,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        category: true,
      },
    })
    total = await prisma.product.count({ where: { status: 'ACTIVE' } })
  } catch (error) {
    console.error("CRITICAL: Shop data fetch failed due to connection timeout.", error)
  }

  if (!settings?.shopEnabled) {
    return <ShopClosedGate />
  }

  return (
    <ShopPage
      initialProducts={serializeData(initialProductsData)}
      initialTotal={total}
      settings={serializeData(settings) as any}
    />
  )
}
