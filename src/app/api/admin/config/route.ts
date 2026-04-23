import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { verifyAdminRequest } from "@/lib/auth/admin"

export async function POST(request: Request) {
  try {
    // 1. Auth check
    const admin = await verifyAdminRequest(request)
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Update config
    const data = await request.json()
    const { 
      announcementText, 
      ethosText, 
      heroHeadline, 
      heroSubtitle,
      maintenanceMode,
      lowStockThreshold,
      instagramUrl,
      tiktokUrl,
      twitterUrl,
      contactEmail,
      // Footer
      brandMessage,
      footerLinks,
      waitlistEnabled,
      waitlistText,
    } = data

    const config = await prisma.siteConfig.upsert({
      where: { id: "singleton" },
      update: {
        announcementText,
        ethosText,
        heroHeadline,
        heroSubtitle,
        maintenanceMode,
        lowStockThreshold,
        instagramUrl,
        tiktokUrl,
        twitterUrl,
        contactEmail,
        brandMessage,
        footerLinks,
        waitlistEnabled,
        waitlistText,
      },
      create: {
        id: "singleton",
        announcementText,
        ethosText,
        heroHeadline,
        heroSubtitle,
        maintenanceMode,
        lowStockThreshold,
        instagramUrl,
        tiktokUrl,
        twitterUrl,
        contactEmail,
        brandMessage,
        footerLinks,
        waitlistEnabled: waitlistEnabled ?? true,
        waitlistText,
      }
    })
    
    revalidateTag("site-config")

    return NextResponse.json(config)
  } catch (err) {
    console.error("Config update error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
