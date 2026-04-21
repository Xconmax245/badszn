import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {

  // ── Seed admin user ────────────────────────
  const passwordHash = await bcrypt.hash("Ademola12345#", 12)

  await prisma.adminUser.upsert({
    where: { email: "admin@badszn.com" },
    update: { passwordHash },
    create: {
      email: "admin@badszn.com",
      passwordHash,
      name: "BAD SZN Admin",
      role: "SUPER_ADMIN",
    },
  })

  // ── Seed categories ────────────────────────
  const categories = [
    { name: "Tops",      slug: "tops",      sortOrder: 1 },
    { name: "Bottoms",   slug: "bottoms",   sortOrder: 2 },
    { name: "Outerwear", slug: "outerwear", sortOrder: 3 },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  // ── Seed Site Config (Singleton) ──────────
  await prisma.siteConfig.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      announcementText: "FREE WORLDWIDE SHIPPING ON ALL ORDERS OVER ₦150,000",
      ethosText: "BAD SZN is more than a label. It's an atmospheric shift. Born in the shadows of the metropolitan grind, we create uniforms for those who navigate the chaos with intentionality.",
      heroHeadline: "ENTER THE VOID",
      heroSubtitle: "COLLECTION 001 — NOW LIVE"
    }
  })

  console.log("✅ Database seeded successfully")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
