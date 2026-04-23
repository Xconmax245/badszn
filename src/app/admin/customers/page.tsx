import { prisma } from "@/lib/prisma"
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  ShieldCheck, 
  Mail,
  Smartphone,
  Star,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { formatNaira } from "@/lib/utils/formatCurrency"
import { AdminSearch } from "@/components/admin/AdminSearch"
import { AdminFilter } from "@/components/admin/AdminFilter"

export default async function AdminCustomersPage({ 
  searchParams 
}: { 
  searchParams: { q?: string; tier?: string } 
}) {
  const query = searchParams.q || "";
  const tierFilter = searchParams.tier || undefined;

  const customers = await prisma.customer.findMany({
    where: {
      AND: [
        tierFilter ? { loyaltyTier: tierFilter as any } : {},
        query ? {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
          ]
        } : {}
      ]
    },
    include: {
      orders: {
        select: { total: true, createdAt: true }
      },
      _count: { select: { orders: true } }
    },
    orderBy: { createdAt: "desc" }
  })

  // Global Metrics
  const totalUsers = await prisma.customer.count()
  const newUsersToday = await prisma.customer.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setHours(0,0,0,0)),
      },
    },
  })

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "VIP": return "text-[#FFD700] border-[#FFD700]/30 bg-[#FFD700]/5"
      case "GOLD": return "text-[#D4AF37] border-[#D4AF37]/20 bg-[#D4AF37]/5"
      case "SILVER": return "text-[#C0C0C0] border-[#C0C0C0]/20 bg-[#C0C0C0]/5"
      default: return "text-white/40 border-white/10 bg-white/5"
    }
  }

  const tierOptions = [
    { label: "Bronze", value: "BRONZE" },
    { label: "Silver", value: "SILVER" },
    { label: "Gold", value: "GOLD" },
    { label: "VIP", value: "VIP" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Customer Registry</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 italic">Global identity logs and loyalty tracking.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <AdminSearch placeholder="USERNAME / EMAIL / NAME..." />
          <AdminFilter queryKey="tier" options={tierOptions} label="Loyalty Tiers" />
        </div>
      </div>

      {/* Global Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 glass-aura rounded-2xl">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Total_Users</p>
          <p className="text-2xl font-black text-white">{totalUsers}</p>
        </div>
        <div className="p-6 glass-aura rounded-2xl">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">New_Today</p>
          <p className="text-2xl font-black text-white">{newUsersToday}</p>
        </div>
      </div>

      <div className="bg-[#111111] border border-white/[0.05] rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.05] bg-white/[0.01]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Orders</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Spent</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">AOV</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Joined</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-15">
                      <Users className="w-12 h-12" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">No authenticated identities found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => {
                  const totalOrders = customer._count.orders
                  const totalSpent = customer.orders.reduce((acc, o) => acc + Number(o.total), 0)
                  const aov = totalOrders > 0 ? totalSpent / totalOrders : 0
                  
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
                    <tr key={customer.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/20 relative overflow-hidden group-hover:border-white/20 transition-all">
                             {customer.avatarUrl ? (
                               <img src={customer.avatarUrl} alt={customer.username} className="w-full h-full object-cover" />
                             ) : (
                               <span className="font-black text-[10px]">{customer.username.substring(0,2).toUpperCase()}</span>
                             )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                               <p className="text-[11px] font-black uppercase tracking-widest text-white">@{customer.username}</p>
                               {customer.supabaseUid && <ShieldCheck className="w-3 h-3 text-blue-500/50" />}
                            </div>
                            <p className="text-[9px] text-white/20 mt-1 uppercase font-bold truncate max-w-[150px]">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className="text-[10px] font-black text-white/40">{totalOrders} ORDERS</span>
                      </td>
                      <td className="px-8 py-5 font-mono text-[11px] text-white">
                         {formatNaira(totalSpent)}
                      </td>
                      <td className="px-8 py-5 font-mono text-[11px] text-white/40">
                         {formatNaira(aov)}
                      </td>
                      <td className="px-8 py-5">
                         <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.15em] border ${statusColor}`}>
                            <Star className="w-2.5 h-2.5 fill-current" />
                            {status}
                         </div>
                      </td>
                      <td className="px-8 py-5 text-[10px] text-white/20 font-bold uppercase tracking-widest">
                         {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5 text-right">
                         <div className="flex items-center justify-end gap-1">
                            <Link 
                              href={`/admin/customers/${customer.id}`}
                              className="p-2 text-white/20 hover:text-white transition-all inline-flex"
                              data-cursor="hover"
                            >
                               <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <a 
                               href={`mailto:${customer.email}`}
                               className="p-2 text-white/20 hover:text-white transition-all inline-flex"
                               data-cursor="hover"
                            >
                               <Mail className="w-3.5 h-3.5" />
                            </a>
                         </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
