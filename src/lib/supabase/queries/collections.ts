import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"

export type CarouselCollection = {
  id:           string
  name:         string
  slug:         string
  description:  string | null
  imageUrl:     string | null
  featuredOrder: number
  productCount: number
}

export const getFeaturedCollections = unstable_cache(
  async (): Promise<CarouselCollection[]> => {
    // Only fetch collections that are featured AND active
    const collections = await prisma.collection.findMany({
      where: {
        isFeatured: true,
        isActive:   true,
        featuredOrder: { not: null },
      },
      orderBy: { featuredOrder: "asc" },
      include: {
        products: { select: { id: true } },
      },
    })

    return collections.map((c) => ({
      id:            c.id,
      name:          c.name,
      slug:          c.slug,
      description:   c.description,
      imageUrl:      c.imageUrl,
      featuredOrder: c.featuredOrder!,
      productCount:  c.products.length,
    }))
  },
  ["featured-collections"],
  { revalidate: 3600, tags: ["featured-collections"] }
)
