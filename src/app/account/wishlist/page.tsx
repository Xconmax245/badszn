import { getOrCreateCustomer } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { serializeData } from "@/lib/utils/serialize"
import { ProductCard } from "@/components/shop/ProductCard"
import { getSiteConfig } from "@/lib/actions/system"

export default async function WishlistPage() {
  const customer = await getOrCreateCustomer()
  if (!customer) redirect("/auth")

  const customerWithWishlist = await prisma.customer.findUnique({
    where: { id: customer.id },
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

  const wishlistItems = customerWithWishlist?.wishlist || []
  const config = await getSiteConfig()

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-white/20" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Saved Items</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-[-0.04em] leading-none">
            WISHLIST
          </h1>
          <p className="text-xs md:text-sm text-white/30 uppercase tracking-[0.2em] font-medium max-w-xl leading-relaxed">
            Your personal selection of items saved for future consideration.
          </p>
        </header>

        {wishlistItems.length === 0 ? (
          <div className="py-24 border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">No items found</p>
            <a href="/shop" className="text-xs font-bold uppercase tracking-widest text-white hover:text-accent-red transition-colors">
              Discover the Collection →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {wishlistItems.map((item: any) => (
              <ProductCard 
                key={item.id} 
                product={serializeData(item.product) as any} 
                settings={serializeData(config) as any}
                onClick={() => {}} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
