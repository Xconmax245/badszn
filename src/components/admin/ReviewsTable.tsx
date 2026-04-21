"use client";

import { useState } from "react";
import { 
  MessageSquare, 
  Star, 
  Pin
} from "lucide-react";
import { ReviewActionButtons } from "./ReviewActionButtons";
import { BulkActionBar } from "./BulkActionBar";

interface ReviewsTableProps {
  initialReviews: any[];
}

export function ReviewsTable({ initialReviews }: ReviewsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === initialReviews.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialReviews.map(r => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
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
                       checked={selectedIds.length === initialReviews.length && initialReviews.length > 0}
                       onChange={toggleSelectAll}
                       className="w-4 h-4 rounded border-white/10 bg-white/5 accent-white cursor-pointer" 
                     />
                   </div>
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Customer</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Product</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Rating/Body</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Status</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {initialReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-15">
                      <MessageSquare className="w-12 h-12" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">No archive reviews found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                initialReviews.map((review) => (
                  <tr 
                    key={review.id} 
                    className={`group transition-colors ${selectedIds.includes(review.id) ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"}`}
                  >
                    <td className="px-8 py-5">
                       <input 
                         type="checkbox" 
                         checked={selectedIds.includes(review.id)}
                         onChange={() => toggleSelect(review.id)}
                         className="w-4 h-4 rounded border-white/10 bg-white/5 accent-white cursor-pointer" 
                       />
                    </td>
                    <td className="px-8 py-5" onClick={() => toggleSelect(review.id)}>
                       <p className="text-[11px] font-black uppercase tracking-widest text-white">@{review.customer.username}</p>
                       <p className="text-[9px] text-white/20 mt-1 uppercase font-bold">{review.customer.firstName} {review.customer.lastName}</p>
                    </td>
                    <td className="px-8 py-5" onClick={() => toggleSelect(review.id)}>
                       <p className="text-[10px] font-bold text-white/50 uppercase">{review.product.name}</p>
                    </td>
                    <td className="px-8 py-5 max-w-xs" onClick={() => toggleSelect(review.id)}>
                       <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                             <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? "fill-white text-white" : "text-white/10"}`} />
                          ))}
                       </div>
                       <p className="text-[11px] text-white/60 leading-relaxed font-medium italic lowercase line-clamp-2">"{review.body}"</p>
                    </td>
                    <td className="px-8 py-5">
                       <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${review.isApproved ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-white/5 text-white/40 border-white/10"}`}>
                          {review.isApproved ? "APPROVED" : "PENDING"}
                       </div>
                       {review.isPinned && <Pin className="w-3 h-3 text-accent-red ml-2 inline-block" />}
                    </td>
                    <td className="px-8 py-5 text-right">
                       <ReviewActionButtons reviewId={review.id} isApproved={review.isApproved} />
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
        type="REVIEW" 
      />
    </>
  );
}
