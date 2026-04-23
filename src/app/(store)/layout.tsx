import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { getSiteConfig } from "@/lib/actions/system"

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const config = await getSiteConfig()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar announcement={config?.announcementText} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
