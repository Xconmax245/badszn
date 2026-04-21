"use server"

import { prisma } from "@/lib/prisma"
import { unstable_cache, revalidateTag } from "next/cache"
import { cache } from "react"

/**
 * FETCH FEATURED COLLECTIONS (DEDUPLICATED & CACHED)
 * ────────────────────────────────────────────────────────
 * Multi-tier caching strategy:
 * 1. React cache() -> De-duplicates hits WITHIN a single request.
 * 2. unstable_cache -> Persists results ACROSS requests (tag-based).
 */
export const getFeaturedCollections = cache(async () => {
  return unstable_cache(
    async () => {
      return prisma.collection.findMany({
        where: {
          isFeatured: true,
          isActive: true,
        },
        orderBy: {
          featuredOrder: "asc",
        },
        include: {
          _count: {
            select: { products: true }
          }
        }
      })
    },
    ["featured-collections"],
    {
      tags: ["featured-collections"],
      revalidate: 3600 // 1 hour fallback
    }
  )()
})

/**
 * UPDATE COLLECTION & REORDER SEQUENCE (TRANSACTIONAL)
 * ────────────────────────────────────────────────────────
 * Implements a continuous order sequence [1, 2, 3...].
 * If a new order is set, it shifts all other featured items
 * to prevent gaps or duplicates.
 */
export async function updateCollectionAndReorder(id: string, data: any) {
  const { isFeatured, featuredOrder, ...rest } = data

  return prisma.$transaction(async (tx) => {
    // 1. Update the target collection first
    const updated = await tx.collection.update({
      where: { id },
      data: {
        ...rest,
        isFeatured,
        featuredOrder: isFeatured ? featuredOrder : null
      }
    })

    // 2. Fetch all collections that should be in the featured sequence
    const allFeatured = await tx.collection.findMany({
      where: { isFeatured: true },
      orderBy: { 
        featuredOrder: "asc",
        updatedAt: "desc" // Use recency as tie-breaker
      }
    })

    // 3. Re-sequence EVERYTHING to ensure a clean [1, 2, 3...] stack
    // This handles insertions, deletions, and moving items perfectly.
    for (let i = 0; i < allFeatured.length; i++) {
       await tx.collection.update({
         where: { id: allFeatured[i].id },
         data: { featuredOrder: i + 1 }
       })
    }

    // 4. Trigger surgical revalidation
    revalidateTag("featured-collections")

    return updated
  })
}
