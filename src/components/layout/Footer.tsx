import { prisma } from "@/lib/prisma"
import FooterClient from "@/components/layout/FooterClient"
// TS Server Bump: 2026-04-21T19:30:10Z

// Seeded default links used when no admin config exists yet
const DEFAULT_FOOTER_LINKS = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "New Drops", href: "/shop/new" },
    { label: "Collections", href: "/shop/collections" },
    { label: "Lookbook", href: "/lookbook" },
  ],
  company: [
    { label: "Ethos", href: "/#ethos" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  support: [
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "FAQs", href: "/faq" },
  ],
  access: [
    { label: "Login", href: "/login" },
    { label: "Waitlist", href: "/#waitlist" },
  ],
}

export default async function Footer() {
  const config = await prisma.siteConfig.findUnique({ where: { id: "singleton" } }) as any

  const footerLinks = (config?.footerLinks as typeof DEFAULT_FOOTER_LINKS | null) ?? DEFAULT_FOOTER_LINKS

  return (
    <FooterClient
      brandMessage={config?.brandMessage ?? "Limited by design."}
      footerLinks={footerLinks}
      instagramUrl={config?.instagramUrl ?? ""}
      twitterUrl={config?.twitterUrl ?? ""}
      contactEmail={config?.contactEmail ?? ""}
      waitlistEnabled={config?.waitlistEnabled ?? true}
      waitlistText={config?.waitlistText ?? "Get early access"}
    />
  )
}
