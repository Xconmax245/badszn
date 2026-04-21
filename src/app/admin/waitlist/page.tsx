import { prisma } from "@/lib/prisma"
import { 
  Clock, 
  Mail, 
  Download, 
  Filter, 
  ChevronRight,
  TrendingUp
} from "lucide-react"

export default async function AdminWaitlistPage() {
  const entries = await prisma.waitlistEntry.findMany({
    include: {
      collection: true,
      customer: true
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Intent Registry</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 italic">Monitor global anticipation for upcoming atmospheric shifts.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-full flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white/10 transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-[#111111] border border-white/[0.05] rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.05] bg-white/[0.01]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Target Campaign</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Captured At</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-15">
                      <TrendingUp className="w-12 h-12" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">No intent signals detected</p>
                    </div>
                  </td>
                </tr>
              ) : (
                entries.map((entry: any) => (
                  <tr key={entry.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                       <p className="text-[11px] font-mono font-bold text-white lowercase">{entry.email}</p>
                       <div className="flex items-center gap-2 mt-1">
                          {entry.customer && <span className="text-[8px] font-black uppercase tracking-widest text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">Verified_User</span>}
                          {entry.phone && <p className="text-[9px] text-white/20 font-bold">{entry.phone}</p>}
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/50">{entry.collection?.name || "GLOBAL_ACC_ENTRY"}</p>
                    </td>
                    <td className="px-8 py-5">
                       <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${entry.notified ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-accent-red/10 text-accent-red border-accent-red/20"}`}>
                          {entry.notified ? "NOTIFIED" : "AWAITING"}
                       </div>
                    </td>
                    <td className="px-8 py-5 text-[10px] text-white/20 font-bold uppercase">
                       {new Date(entry.createdAt).toLocaleString()}
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button className="p-2 text-white/20 hover:text-white transition-all"><ChevronRight className="w-4 h-4" /></button>
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
