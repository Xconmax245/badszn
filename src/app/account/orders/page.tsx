import { getServerUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { serializeData } from "@/lib/utils/serialize"

export default async function OrdersPage() {
  const user = await getServerUser()
  if (!user) redirect("/auth")

  const customer = await prisma.customer.findUnique({
    where: { supabaseUid: user.id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: true
        }
      }
    }
  })

  if (!customer) redirect("/auth")

  const orders = customer.orders

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-accent-red" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-red">Archive Access v1.0</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-[-0.04em] leading-none">
            ORDERS<span className="text-white/10">_</span>
          </h1>
          <p className="text-xs md:text-sm text-white/30 uppercase tracking-[0.3em] font-medium max-w-xl leading-relaxed">
            Your history of authorized acquisitions. Every piece is a fragment of the atmosphere.
          </p>
        </header>

        {orders.length === 0 ? (
          <div className="py-24 border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">No data found in archive</p>
            <a href="/shop" className="text-xs font-bold uppercase tracking-widest text-white hover:text-accent-red transition-colors">
              Begin Acquisition →
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="group border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Ref: {order.orderNumber}</p>
                    <h3 className="text-lg font-bold uppercase tracking-tight text-white/80">
                      ₦{Number(order.total).toLocaleString('en-NG')}
                    </h3>
                    <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-10">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Status</p>
                      <span className="inline-block text-[10px] font-black uppercase tracking-widest text-white/60 px-3 py-1 border border-white/10">
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Items</p>
                      <p className="text-xs font-bold text-white/40">{order.items.length} Units</p>
                    </div>

                    <button className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:bg-accent-red hover:text-white">
                      Inspect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
