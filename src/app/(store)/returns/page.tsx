import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function ReturnsPage() {
  return (
    <div className="bg-black min-h-screen">
      <main className="pt-40 pb-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-8 block">Policy_Registry // 02</span>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-16">Returns</h1>
          
          <div className="space-y-12 text-[11px] font-bold text-white/40 uppercase tracking-[0.25em] leading-relaxed">
            <section>
              <h2 className="text-white mb-4">Policy</h2>
              <p>Due to the limited nature of our drops, all sales are final. We only offer exchanges or returns for defective items.</p>
            </section>
            
            <section>
              <h2 className="text-white mb-4">Defective Items</h2>
              <p>If you receive a damaged or incorrect item, please contact us within 48 hours of delivery at returns@badszn.com with your order number and photos.</p>
            </section>

            <section>
              <h2 className="text-white mb-4">Process</h2>
              <p>Approved returns must be sent back in original, unworn condition with all tags attached.</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
