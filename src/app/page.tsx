import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import PresenceStrip from "@/components/home/PresenceStrip";
import DropCarousel from "@/components/home/DropCarousel";
import BrandEthos from "@/components/home/BrandEthos";
import LookbookStripServer from "@/components/home/LookbookStripServer";
import SignalLayerServer from "@/components/home/SignalLayerServer";
import { getSiteConfig } from "@/lib/actions/system";

export default async function Home() {
  // Fetch Site Config (Deduplicated)
  const config = await getSiteConfig();

  return (
    <main className="bg-bg-primary min-h-screen">
      <Navbar announcement={config?.announcementText} />
      <Hero 
        headline={config?.heroHeadline}
        subtitle={config?.heroSubtitle}
      />
      <PresenceStrip narrative={config?.ethosText} />
      <DropCarousel />
      <BrandEthos />
      <LookbookStripServer />
      <SignalLayerServer />
    </main>
  );
}
