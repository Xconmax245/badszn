import { prisma } from "@/lib/prisma"
import { 
  Plus, 
  Search, 
  Tag, 
  Copy, 
  Clock, 
  Percent,
  CheckCircle2
} from "lucide-react"
import { formatNaira } from "@/lib/utils/formatCurrency"
import { CreateDiscountModal } from "@/components/admin/CreateDiscountModal"
import { DiscountCopyButton } from "@/components/admin/DiscountCopyButton"

export default async function AdminDiscountsPage() {
  const codes = await prisma.discountCode.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Benefit Codes</h1>
           <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 italic">Manipulate conversion through tactical incentives.</p>
        </div>
        
        <CreateDiscountModal />
      </div>

      <div className="bg-[#111111] border border-white/[0.05] rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.05] bg-white/[0.01]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Code</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Type</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Value</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Usage</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Life Cycle</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {codes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-15">
                      <Tag className="w-12 h-12" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">No incentive models active</p>
                    </div>
                  </td>
                </tr>
              ) : (
                codes.map((code: any) => (
                  <tr key={code.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-white">{code.code}</p>
                          <DiscountCopyButton code={code.code} />
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-[10px] font-bold text-white/40 uppercase">{code.type.replace('_', ' ')}</span>
                    </td>
                    <td className="px-8 py-5 font-mono text-xs text-white">
                       {code.type === "PERCENTAGE" 
                          ? `${Number(code.value)}%` 
                          : code.type === "FREE_SHIPPING" 
                            ? "FREE" 
                            : formatNaira(Number(code.value))}
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2">
                          <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-accent-red" style={{ width: `${(code.timesUsed / (code.maxUses || 100)) * 100}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-white/40 uppercase">{code.timesUsed} / {code.maxUses || "∞"}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2 text-[10px] text-white/20 font-bold uppercase tracking-widest">
                          <Clock className="w-3.5 h-3.5" />
                          {code.expiresAt ? new Date(code.expiresAt).toLocaleDateString() : "ETERNAL"}
                       </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${code.isActive ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-white/5 text-white/30 border-white/10"}`}>
                          {code.isActive ? "ACTIVE" : "INACTIVE"}
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
