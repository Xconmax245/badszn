import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function ShippingPage() {
  return (
    <div className="bg-black min-h-screen">
      <main className="pt-40 pb-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-8 block">Policy_Registry // 01</span>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-16">Shipping</h1>
          
          <div className="space-y-12 text-[11px] font-bold text-white/40 uppercase tracking-[0.25em] leading-relaxed">
            <section>
              <h2 className="text-white mb-4">Domestic (Nigeria)</h2>
              <p>Lagos: 1-3 business days. <br />Outside Lagos: 3-5 business days.</p>
            </section>
            
            <section>
              <h2 className="text-white mb-4">International</h2>
              <p>Worldwide shipping available via DHL. <br />7-10 business days depending on customs.</p>
            </section>

            <section>
              <h2 className="text-white mb-4">Processing</h2>
              <p>Orders are processed within 48 hours of payment verification. You will receive a tracking number via email and Telegram once dispatched.</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
