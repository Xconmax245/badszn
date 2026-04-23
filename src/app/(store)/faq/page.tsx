import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function FAQPage() {
  const faqs = [
    { q: "When is the next drop?", a: "Follow our Instagram or join the Telegram waitlist for drop announcements." },
    { q: "How do the items fit?", a: "Most items are designed with a boxy, oversized silhouette. Specific measurements are listed on each product page." },
    { q: "Can I cancel my order?", a: "Orders can only be cancelled within 2 hours of placement." },
    { q: "Do you restock items?", a: "Most pieces are archive-only and will never be restocked once sold out." }
  ]

  return (
    <div className="bg-black min-h-screen">
      <main className="pt-40 pb-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-8 block">Information_Hub // 03</span>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-16">FAQs</h1>
          
          <div className="space-y-16">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-white/5 pb-12">
                <h2 className="text-[14px] font-black text-white uppercase tracking-widest mb-6">0{i+1}_ {faq.q}</h2>
                <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.25em] leading-relaxed max-w-2xl">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
