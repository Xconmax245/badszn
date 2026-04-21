"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  ExternalLink, 
  Clock,
  CheckCircle2,
  Truck
} from "lucide-react";
import { formatNaira } from "@/lib/utils/formatCurrency";
import { BulkActionBar } from "./BulkActionBar";

interface OrdersTableProps {
  initialOrders: any[];
}

export function OrdersTable({ initialOrders }: OrdersTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === initialOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialOrders.map(o => o.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-white/5 text-white/40 border-white/10";
      case "PAID": return "bg-green-400/10 text-green-400 border-green-400/20";
      case "SHIPPED": return "bg-blue-400/10 text-blue-400 border-blue-400/20";
      case "DELIVERED": return "bg-purple-400/10 text-purple-400 border-purple-400/20";
      default: return "bg-white/5 text-white/30 border-white/10";
    }
  };

  return (
    <>
      <div className="bg-[#111111] border border-white/[0.05] rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.05] bg-white/[0.01]">
                <th className="px-8 py-5 w-10">
                   <div className="flex items-center">
                     <input 
                       type="checkbox" 
                       checked={selectedIds.length === initialOrders.length && initialOrders.length > 0}
                       onChange={toggleSelectAll}
                       className="w-4 h-4 rounded border-white/10 bg-white/5 accent-white cursor-pointer" 
                     />
                   </div>
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Order Ref</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Customer</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Items</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Total</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Payment</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Fulfillment</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {initialOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-15">
                      <ShoppingBag className="w-12 h-12" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">No transaction logs found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                initialOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className={`group transition-colors ${selectedIds.includes(order.id) ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"}`}
                  >
                    <td className="px-8 py-5">
                       <input 
                         type="checkbox" 
                         checked={selectedIds.includes(order.id)}
                         onChange={() => toggleSelect(order.id)}
                         className="w-4 h-4 rounded border-white/10 bg-white/5 accent-white cursor-pointer" 
                       />
                    </td>
                    <td className="px-8 py-5" onClick={() => toggleSelect(order.id)}>
                      <p className="text-[11px] font-black uppercase tracking-widest text-white">#{order.orderNumber}</p>
                      <p className="text-[9px] text-white/20 mt-1 uppercase font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-5" onClick={() => toggleSelect(order.id)}>
                      <p className="text-[11px] font-bold text-white/80 uppercase tracking-tight">{order.guestFirstName || order.customer?.firstName} {order.guestLastName || order.customer?.lastName}</p>
                      <p className="text-[9px] text-white/20 mt-1 lowercase font-mono">{order.guestEmail || order.customer?.email}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{order._count.items} Units</span>
                    </td>
                    <td className="px-8 py-5 font-mono text-[12px] text-white">
                      {formatNaira(Number(order.total))}
                    </td>
                    <td className="px-8 py-5">
                       <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus === "PAID" && <CheckCircle2 className="w-3 h-3" />}
                          {order.paymentStatus}
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusColor(order.fulfillmentStatus)}`}>
                          {order.fulfillmentStatus === "UNFULFILLED" ? <Clock className="w-3 h-3" /> : order.fulfillmentStatus === "FULFILLED" ? <CheckCircle2 className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                          {order.fulfillmentStatus}
                       </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <Link 
                         href={`/admin/orders/${order.id}`}
                         className="p-2 text-white/20 hover:text-white transition-all inline-flex"
                         data-cursor="hover"
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

      <BulkActionBar 
        selectedIds={selectedIds} 
        clearSelection={() => setSelectedIds([])} 
        type="ORDER" 
      />
    </>
  );
}
