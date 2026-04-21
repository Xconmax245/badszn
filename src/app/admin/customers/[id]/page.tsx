import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Users, 
  ShoppingBag, 
  Mail, 
  MessageCircle, 
  Calendar,
  TrendingUp,
  Award,
  ExternalLink,
  ShieldCheck,
  CreditCard
} from "lucide-react";
import { formatNaira } from "@/lib/utils/formatCurrency";

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { items: true } } }
      },
      addresses: true,
    },
  });

  if (!customer) notFound();

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "VIP": return "text-purple-400 bg-purple-400/10 border-purple-400/20";
      case "GOLD": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "SILVER": return "text-slate-300 bg-slate-300/10 border-slate-300/20";
      default: return "text-white/40 bg-white/5 border-white/10";
    }
  };

  const formattedJoinDate = new Date(customer.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* ─── HEADER ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <Link 
            href="/admin/customers" 
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors mb-6"
            data-cursor="hover"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Registry
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black uppercase tracking-tight text-white">
              {customer.firstName} {customer.lastName}
            </h1>
            <span className="text-[12px] font-mono text-white/20 tracking-tighter">@{customer.username}</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mt-3 italic leading-relaxed">
            Member since {formattedJoinDate} • Part of the {customer.loyaltyTier} Collective
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href={`mailto:${customer.email}`}
            className="flex items-center gap-2 px-6 py-3.5 bg-white/[0.03] border border-white/10 rounded-full text-white/80 text-[11px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            data-cursor="hover"
          >
            <Mail className="w-4 h-4" /> Send Email
          </a>
          
          {customer.phone && (
            <a 
              href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`}
              target="_blank"
              className="flex items-center gap-2 px-6 py-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)]"
              data-cursor="hover"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* ─── METRICS ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-black border border-white/10 rounded-[2rem] space-y-6">
          <div className="flex items-center justify-between">
            <TrendingUp className="w-5 h-5 text-emerald-500/40" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Lifetime Value</span>
          </div>
          <div>
            <p className="text-3xl font-black text-white mb-1.5">{formatNaira(Number(customer.totalSpend))}</p>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Total Net Spend</p>
          </div>
        </div>

        <div className="p-8 bg-black border border-white/10 rounded-[2rem] space-y-6">
          <div className="flex items-center justify-between">
            <ShoppingBag className="w-5 h-5 text-blue-500/40" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Frequency</span>
          </div>
          <div>
            <p className="text-3xl font-black text-white mb-1.5">{customer.orders.length} Orders</p>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Purchase Registry</p>
          </div>
        </div>

        <div className="p-8 bg-black border border-white/10 rounded-[2rem] space-y-6">
          <div className="flex items-center justify-between">
            <Award className="w-5 h-5 text-purple-500/40" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Recognition</span>
          </div>
          <div>
            <p className={`text-3xl font-black mb-1.5 p-0 bg-transparent ${getTierColor(customer.loyaltyTier).split(' ')[0]}`}>
              {customer.loyaltyTier}
            </p>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Loyalty Status</p>
          </div>
        </div>
      </div>

      {/* ─── ORDER HISTORY ──────────────────────────────────── */}
      <div className="bg-black border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-4">
             <Clock className="w-4 h-4 text-white/20" />
             <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Transaction History</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.03]">
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-white/15">Order</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-white/15">Date</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-white/15">Total</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-white/15">Status</th>
                <th className="px-10 py-6 text-right text-[10px] font-bold uppercase tracking-widest text-white/15">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {customer.orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center text-[10px] font-bold text-white/10 uppercase tracking-widest">
                    No transaction logs associated with this identity.
                  </td>
                </tr>
              ) : (
                customer.orders.map((order) => (
                  <tr key={order.id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-10 py-6">
                      <span className="text-[12px] font-bold text-white">#{order.orderNumber}</span>
                      <p className="text-[10px] text-white/20 mt-1 uppercase font-bold tracking-widest">{order._count.items} Items</p>
                    </td>
                    <td className="px-10 py-6 text-[12px] text-white/50 font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-10 py-6 text-[12px] font-mono text-white/90">
                      {formatNaira(Number(order.total))}
                    </td>
                    <td className="px-10 py-6">
                       <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{order.status}</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <Link 
                         href={`/admin/orders/${order.id}`} 
                         className="p-2.5 rounded-full bg-white/[0.03] border border-white/10 text-white/20 hover:text-white transition-all inline-flex"
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
    </div>
  );
}
