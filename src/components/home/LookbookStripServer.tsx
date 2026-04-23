import { prisma } from "@/lib/prisma"
import LookbookStrip from "./LookbookStrip"

// Next.js cache revalidation tag
export const revalidate = 3600 // Revalidate every hour, or tag-based if preferred

export default async function LookbookStripServer() {
  let entries = []
  try {
    entries = await prisma.lookbookEntry.findMany({
      where: {
        isPublished: true
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      take: 20,
      select: {
        id: true,
        imageUrl: true,
        title: true,
        layoutType: true,
      }
    })
  } catch (error) {
    console.error("LookbookStripServer: Failed to fetch entries", error)
    return null
  }

  if (!entries || entries.length === 0) return null

  // Ensure type alignment for the client component
  const formattedEntries = entries.map(entry => ({
    ...entry,
    layoutType: entry.layoutType as "SMALL" | "MEDIUM" | "LARGE" | "OVERSIZED"
  }))

  return <LookbookStrip entries={formattedEntries} />
}
