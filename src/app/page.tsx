import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";

export default function Home() {
  return (
    <main className="bg-bg-primary min-h-screen">
      <Navbar />
      <Hero />
      {/* Spacer to demonstrate parallax scrolling */}
      <section 
        className="relative z-10 min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-6"
        data-aos="fade-up"
        data-aos-duration="1200"
      >
        <div 
          className="w-16 h-1 bg-accent-red"
          data-aos="zoom-in"
          data-aos-delay="300"
        />
        <p 
          className="text-text-muted text-sm tracking-[0.2em] uppercase text-center max-w-xs"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          More content coming soon
        </p>
      </section>
    </main>
  );
}
