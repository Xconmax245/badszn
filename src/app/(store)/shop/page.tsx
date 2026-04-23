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
  let isError = false
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
    isError = true
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">System_Offline</h1>
          <p className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em]">Database connection timeout. Synchronizing...</p>
        </div>
        <div className="w-12 h-[1px] bg-white/10 animate-pulse" />
      </main>
    )
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
