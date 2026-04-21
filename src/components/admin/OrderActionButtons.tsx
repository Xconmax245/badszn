"use client";

import { useOptimistic, useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from "lucide-react";

interface Props {
  orderId: string;
  currentStatus: string;
}

export function OrderActionButtons({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    currentStatus,
    (state, newStatus: string) => newStatus
  );

  const updateStatus = async (newStatus: string) => {
    setError(null);
    startTransition(async () => {
      setOptimisticStatus(newStatus);
      try {
        const response = await fetch(`/api/admin/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            status: newStatus,
            fulfillmentStatus: newStatus === "DELIVERED" ? "FULFILLED" : "PARTIALLY_FULFILLED"
          }),
        });

        if (!response.ok) throw new Error("Failed to update status");
        
        router.refresh();
      } catch (err) {
        setError("Fulfillment sync failed. Please retry.");
        console.error(err);
      }
    });
  };

  const actions = [
    { label: "Pack Order", status: "PACKED", icon: Package, color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
    { label: "Mark Shipped", status: "SHIPPED", icon: Truck, color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
    { label: "Deliver", status: "DELIVERED", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {actions.map((action) => {
          const isActive = optimisticStatus === action.status;
          const isTargetLoading = isPending && optimisticStatus === action.status;

          return (
            <button
              key={action.status}
              disabled={isPending || isActive}
              onClick={() => updateStatus(action.status)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border transition-all duration-300 font-bold text-[11px] uppercase tracking-widest
                ${isActive ? "bg-white/10 border-white/20 text-white opacity-100" : "opacity-40 hover:opacity-100 hover:border-white/20"}
                ${isTargetLoading ? "animate-pulse" : ""}
                ${isActive ? "cursor-default" : "cursor-pointer"}
              `}
              data-cursor="hover"
            >
              {isTargetLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <action.icon className="w-4 h-4" />}
              {action.label}
            </button>
          );
        })}
      </div>
      
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
