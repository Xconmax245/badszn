import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"

/**
 * FETCH SITE CONFIG (APP-WIDE CACHE)
 * ────────────────────────────────────────────────────────
 * Wrapped in unstable_cache to share the config across 
 * all concurrent requests. This prevents connection pool 
 * timeouts during peak dashboard activity by ensuring 
 * we only hit the DB once per config update.
 */
export const getSiteConfig = unstable_cache(
  async () => {
    return prisma.siteConfig.findUnique({
      where: { id: "singleton" }
    })
  },
  ["site-config"],
  { tags: ["site-config"], revalidate: 3600 }
)
