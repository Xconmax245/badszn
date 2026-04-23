import { getServerUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { serializeData } from "@/lib/utils/serialize"
import { ProductCard } from "@/components/shop/ProductCard"
import { getSiteConfig } from "@/lib/actions/system"

export default async function WishlistPage() {
  const user = await getServerUser()
  if (!user) redirect("/auth")

  const customer = await prisma.customer.findUnique({
    where: { supabaseUid: user.id },
    include: {
      wishlist: {
        include: {
          product: {
            include: {
              images: { orderBy: { sortOrder: 'asc' } },
              variants: true,
              category: true
            }
          }
        }
      }
    }
  })

  if (!customer) redirect("/auth")

  const wishlistItems = customer.wishlist
  const config = await getSiteConfig()

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-accent-red" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-red">Selected Artifacts v1.0</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-[-0.04em] leading-none">
            WISHLIST<span className="text-white/10">_</span>
          </h1>
          <p className="text-xs md:text-sm text-white/30 uppercase tracking-[0.3em] font-medium max-w-xl leading-relaxed">
            Reserved visions. Items you have designated for future acquisition.
          </p>
        </header>

        {wishlistItems.length === 0 ? (
          <div className="py-24 border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Empty registry</p>
            <a href="/shop" className="text-xs font-bold uppercase tracking-widest text-white hover:text-accent-red transition-colors">
              Explore Shop →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {wishlistItems.map((item) => (
              <ProductCard 
                key={item.id} 
                product={serializeData(item.product) as any} 
                settings={serializeData(config) as any}
                onClick={() => {}} // In a real app, this would open quick view or navigate
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
