import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { revalidateTag } from "next/cache"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret")

export async function POST(request: Request) {
  try {
    // 1. Auth check
    const token = cookies().get("admin_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
      await jwtVerify(token, JWT_SECRET)
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
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
