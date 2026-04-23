import { getSiteConfig } from "@/lib/actions/system"
import FooterClient from "@/components/layout/FooterClient"

// Seeded default links used when no admin config exists yet
const DEFAULT_FOOTER_LINKS = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "New Drops", href: "/shop?sort=new" },
    { label: "Collections", href: "/collections" },
    { label: "Lookbook", href: "/lookbook" },
  ],
  company: [
    { label: "Ethos", href: "/about#ethos" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  support: [
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "FAQs", href: "/faq" },
  ],
  access: [
    { label: "Account", href: "/account" },
    { label: "Waitlist", href: "/#waitlist" },
  ],
}

export default async function Footer() {
  let config = null
  try {
    config = await getSiteConfig() as any
  } catch (error) {
    console.error("Footer: Failed to fetch site config", error)
  }

  const footerLinks = (config?.footerLinks as typeof DEFAULT_FOOTER_LINKS | null) ?? DEFAULT_FOOTER_LINKS

  return (
    <FooterClient
      brandMessage={config?.brandMessage ?? "BAD SZN — Built different. Worn louder."}
      footerLinks={footerLinks}
      instagramUrl={config?.instagramUrl ?? ""}
      twitterUrl={config?.twitterUrl ?? ""}
      contactEmail={config?.contactEmail ?? ""}
      waitlistEnabled={config?.waitlistEnabled ?? true}
      waitlistText={config?.waitlistText ?? "Get early access"}
    />
  )
}
