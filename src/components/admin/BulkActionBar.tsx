"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  X, 
  Trash2, 
  CheckCircle2, 
  Truck, 
  Loader2,
  AlertCircle
} from "lucide-react";

interface Props {
  selectedIds: string[];
  clearSelection: () => void;
  type: "ORDER" | "REVIEW";
  // Custom actions based on type
}

export function BulkActionBar({ selectedIds, clearSelection, type }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const count = selectedIds.length;
  if (count === 0) return null;

  const handleBulkAction = async (action: string, value: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, type, action, value }),
      });

      if (!response.ok) throw new Error("Bulk action failed");
      
      clearSelection();
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="glass-aura text-white px-8 py-5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center gap-8">
        
        <div className="flex items-center gap-4 pr-8 border-r border-white/10">
          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-[11px] font-black">
            {count}
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 text-aura-glow">Selected</p>
        </div>

        <div className="flex items-center gap-3">
          {type === "ORDER" && (
            <button 
              disabled={loading || count > 50}
              onClick={() => handleBulkAction("SET_STATUS", "SHIPPED")}
              className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-white/90 rounded-full text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50"
              data-cursor="hover"
              data-magnetic
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Truck className="w-3.5 h-3.5" />}
              Mark Shipped
            </button>
          )}

          {type === "REVIEW" && (
            <button 
              disabled={loading || count > 50}
              onClick={() => handleBulkAction("SET_APPROVED", true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-white/90 rounded-full text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50"
              data-cursor="hover"
              data-magnetic
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              Approve All
            </button>
          )}

          <button 
             onClick={clearSelection}
             className="p-2 text-white/20 hover:text-white transition-colors"
             data-cursor="hover"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {count > 50 && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-full text-center animate-bounce">
            <span className="bg-red-500 text-white text-[8px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
              Batch cap (50) exceeded
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
