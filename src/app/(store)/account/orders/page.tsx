import { prisma } from "@/lib/prisma"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

function formatStatus(status: string) {
  switch (status) {
    case "PAID": return "Payment received"
    case "PROCESSING": return "Preparing your order"
    case "SHIPPED": return "On the way"
    case "DELIVERED": return "Delivered"
    case "CANCELLED": return "Cancelled"
    default: return "Pending"
  }
}

export default async function OrdersPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { customer: { supabaseUid: user.id } },
        { guestEmail: user.email }
      ]
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto space-y-12">
        <header className="space-y-2">
          <p className="text-[12px] font-semibold text-white/30">My Account</p>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Orders</h1>
        </header>

        <div className="flex flex-col gap-4">
          {orders.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="text-white/40 text-sm">You haven't placed any orders yet.</p>
              <Link href="/shop" className="inline-block text-[12px] font-semibold text-white underline underline-offset-8">
                Start Shopping
              </Link>
            </div>
          ) : (
            orders.map(order => (
              <Link 
                key={order.id} 
                href={`/order/${order.id}`}
                className="group flex flex-col gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[12px] font-semibold text-white/30 uppercase tracking-wider">
                      #{order.orderNumber || order.id.slice(0, 8)}
                    </p>
                    <h3 className="text-lg font-semibold text-white">
                      ₦{Number(order.total).toLocaleString()}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                    order.status === 'PAID' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                    order.status === 'SHIPPED' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                    'bg-white/10 border-white/10 text-white/40'
                  }`}>
                    {formatStatus(order.status)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-white/[0.03]">
                  <p className="text-[12px] text-white/20">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                  <span className="text-[12px] font-semibold text-white/40 group-hover:text-white transition-colors">
                    Track Order →
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
