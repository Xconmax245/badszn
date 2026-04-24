import { getOrCreateCustomer } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Package, Clock, ShieldCheck, ShoppingBag } from "lucide-react"

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const customer = await getOrCreateCustomer()
  if (!customer) redirect("/auth")

  const order = await prisma.order.findUnique({
    where: { 
      id: params.id,
      customerId: customer.id // Ensure they own it
    },
    include: {
      items: true
    }
  })

  if (!order) notFound()

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto space-y-16">
        <Link 
          href="/account/orders"
          className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Back to History
        </Link>

        <header className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Authentication Verified / Order Record</p>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">#{order.orderNumber}</h1>
            </div>
            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{order.status}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
            <div className="flex items-center gap-3 text-white/20">
              <Clock size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Timeline</span>
            </div>
            <p className="text-xl font-black text-white/80">
              {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
            <div className="flex items-center gap-3 text-white/20">
              <Package size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Protocol</span>
            </div>
            <p className="text-xl font-black text-white/80">
              Standard Shipping
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
            <div className="flex items-center gap-3 text-white/20">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Total Value</span>
            </div>
            <p className="text-xl font-black text-white/80">
              ₦{Number(order.total).toLocaleString()}
            </p>
          </div>
        </div>

        <section className="space-y-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 px-2 flex items-center gap-3">
            <ShoppingBag size={12} />
            ACQUISITION_LOG
          </h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="p-8 rounded-3xl bg-white/[0.01] border border-white/5 flex items-center justify-between group">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={24} className="text-white/10" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-white uppercase tracking-tight">{item.name}</h4>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{item.size} • QTY {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-white/80">₦{Number(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Support Reference</p>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Contact support@badszn.com for logistics inquiries</p>
          </div>
          <Link 
            href="/shop"
            className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:scale-105 active:scale-95 transition-all"
          >
            Continue Discovery
          </Link>
        </footer>
      </div>
    </div>
  )
}
