import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Calendar, 
  CreditCard, 
  ArrowLeft,
  Star,
  ShieldCheck,
  Mail,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { formatNaira } from "@/lib/utils/formatCurrency"
import { formatDistanceToNow } from "date-fns"

export default async function CustomerDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: true
        }
      },
      savedAddresses: true
    }
  })

  if (!customer) notFound()

  // Metrics calculation
  const totalOrders = customer.orders.length
  const totalSpent  = customer.orders.reduce((acc, o) => acc + Number(o.total), 0)
  const aov         = totalOrders > 0 ? totalSpent / totalOrders : 0
  
  // Segmentation
  let status = "REGISTERED ONLY"
  let statusColor = "text-white/40 border-white/10 bg-white/5"
  
  if (totalSpent > 200000) {
    status = "VIP"
    statusColor = "text-[#FFD700] border-[#FFD700]/30 bg-[#FFD700]/5"
  } else if (totalOrders >= 5) {
    status = "LOYAL"
    statusColor = "text-emerald-500 border-emerald-500/30 bg-emerald-500/5"
  } else if (totalOrders >= 1) {
    status = "NEW"
    statusColor = "text-blue-500 border-blue-500/30 bg-blue-500/5"
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <Link 
            href="/admin/customers"
            className="w-12 h-12 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black uppercase tracking-tight text-white">@{customer.username}</h1>
              <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor}`}>
                {status}
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
              Identity_Registry: {customer.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href={`mailto:${customer.email}`}
            className="px-8 py-4 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/90 transition-all flex items-center gap-3"
          >
            <Mail className="w-4 h-4" />
            Contact Customer
          </a>
        </div>
      </div>

      {/* ─── METRICS GRID ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Lifetime Spend", value: formatNaira(totalSpent), icon: CreditCard, sub: "Gross Revenue" },
          { label: "Total Orders", value: totalOrders, icon: ShoppingBag, sub: `${customer.orders.filter(o => o.status === 'DELIVERED').length} fulfilled` },
          { label: "Avg Order Value", value: formatNaira(aov), icon: Star, sub: "Spending Power" },
          { label: "Account Age", value: formatDistanceToNow(new Date(customer.createdAt)), icon: Calendar, sub: `Joined ${new Date(customer.createdAt).toLocaleDateString()}` },
        ].map((m, i) => (
          <div key={i} className="p-8 glass-aura rounded-[2.5rem] relative overflow-hidden group">
            <m.icon className="w-5 h-5 text-white/10 mb-6 group-hover:text-white/40 transition-colors" />
            <p className="text-2xl font-black text-white mb-2">{m.value}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{m.label}</p>
            <p className="text-[8px] font-bold uppercase tracking-widest text-white/10 mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* ─── ORDER HISTORY ─── */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 px-2">Order_Registry_Stream</h3>
          <div className="bg-[#111111] border border-white/[0.05] rounded-[2rem] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.05] bg-white/[0.01]">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Order</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Total</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Date</th>
                  <th className="px-8 py-5 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {customer.orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-white/10 text-[10px] font-black uppercase tracking-[0.3em]">
                      No transaction history found
                    </td>
                  </tr>
                ) : (
                  customer.orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-white/[0.01] transition-all">
                      <td className="px-8 py-6">
                        <p className="text-[11px] font-black text-white uppercase tracking-widest">#{order.orderNumber}</p>
                        <p className="text-[9px] text-white/20 uppercase font-bold mt-1">{order.items.length} Items</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                          order.status === 'DELIVERED' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' :
                          order.status === 'CANCELLED' ? 'text-red-500 border-red-500/20 bg-red-500/5' :
                          'text-amber-500 border-amber-500/20 bg-amber-500/5'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-mono text-xs text-white">
                        {formatNaira(Number(order.total))}
                      </td>
                      <td className="px-8 py-6 text-[10px] text-white/20 font-bold uppercase">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link 
                          href={`/admin/orders/${order.id}`}
                          className="p-2 text-white/10 hover:text-white transition-all inline-flex"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── ADDRESSES & PROFILE ─── */}
        <div className="col-span-12 lg:col-span-4 space-y-10">
          {/* Profile Card */}
          <div className="p-10 glass-aura rounded-[2.5rem] relative overflow-hidden">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 mb-8">Identity_Snapshot</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">Legal Name</p>
                <p className="text-[13px] font-black text-white uppercase tracking-widest">{customer.firstName} {customer.lastName}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">Primary Email</p>
                <p className="text-[13px] font-black text-white lowercase tracking-tight">{customer.email}</p>
              </div>
              {customer.supabaseUid && (
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500/50" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Verified via Supabase Auth</span>
                </div>
              )}
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 px-2">Logistics_Log</h3>
            <div className="space-y-4">
              {customer.savedAddresses.length === 0 ? (
                <div className="p-8 border border-dashed border-white/10 rounded-3xl text-center opacity-20">
                  <MapPin className="w-5 h-5 mx-auto mb-3" />
                  <p className="text-[9px] font-black uppercase tracking-widest">No addresses logged</p>
                </div>
              ) : (
                customer.savedAddresses.map((addr) => (
                  <div key={addr.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl relative group hover:border-white/10 transition-all">
                    {addr.isDefault && (
                      <span className="absolute top-6 right-6 text-[8px] font-black bg-white/10 text-white/40 px-2 py-1 rounded-full uppercase tracking-widest">Default</span>
                    )}
                    <p className="text-[11px] font-black text-white uppercase tracking-widest mb-3">{addr.fullName}</p>
                    <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest leading-relaxed">
                      {addr.line1}<br />
                      {addr.line2 && <>{addr.line2}<br /></>}
                      {addr.city}, {addr.state}<br />
                      {addr.phone}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
