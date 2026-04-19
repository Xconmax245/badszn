import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import PresenceStrip from "@/components/home/PresenceStrip";

export default function Home() {
  return (
    <main className="bg-bg-primary min-h-screen">
      <Navbar />
      <Hero />
      <PresenceStrip />
    </main>
  );
}
