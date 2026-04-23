import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function ContactPage() {
  return (
    <div className="bg-black min-h-screen">
      <main className="pt-40 pb-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-8 block">Connect_Layer // 04</span>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-16">Contact</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="space-y-12">
               <div>
                  <h2 className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] mb-4">Support_Queries</h2>
                  <p className="text-xl font-black text-white uppercase tracking-tighter">support@badszn.com</p>
               </div>
               <div>
                  <h2 className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] mb-4">Inquiries_Media</h2>
                  <p className="text-xl font-black text-white uppercase tracking-tighter">media@badszn.com</p>
               </div>
            </div>
            
            <div className="space-y-12">
               <div>
                  <h2 className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] mb-4">Location_Base</h2>
                  <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.25em] leading-relaxed">
                    Lagos, Nigeria <br /> Studio Operations only. <br /> Physical showroom by appointment only.
                  </p>
               </div>
               <div>
                  <h2 className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] mb-4">Social_Signals</h2>
                  <div className="flex gap-6">
                    <a href="#" className="text-[11px] font-black text-white uppercase tracking-widest hover:text-red-600 transition-colors">Instagram</a>
                    <a href="#" className="text-[11px] font-black text-white uppercase tracking-widest hover:text-red-600 transition-colors">Twitter</a>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
