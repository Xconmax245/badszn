"use client";

import { useState, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface Props {
  reviewId: string;
  isApproved: boolean;
}

export function ReviewActionButtons({ reviewId, isApproved }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticApproved, setOptimisticApproved] = useOptimistic(
    isApproved,
    (state, newState: boolean) => newState
  );

  const toggleApproval = async (newState: boolean) => {
    startTransition(async () => {
      setOptimisticApproved(newState);
      try {
        const response = await fetch(`/api/admin/reviews/${reviewId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isApproved: newState }),
        });

        if (!response.ok) throw new Error("Failed to update review");
        
        router.refresh();
      } catch (err) {
        console.error(err);
        // On error, the optimistic state will automatically revert when the transition ends
        // But since router.refresh hasn't happened yet, it might flick.
        // We'll trust the transition for now.
      }
    });
  };

  return (
    <div className="flex items-center justify-end gap-3">
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin text-white/20" />
      ) : (
        <>
          {!optimisticApproved ? (
            <button 
              onClick={() => toggleApproval(true)}
              className="text-white/20 hover:text-green-400 transition-colors"
              title="Approve Review"
              data-cursor="hover"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={() => toggleApproval(false)}
              className="text-green-400/50 hover:text-red-400 transition-colors"
              title="Unapprove Review"
              data-cursor="hover"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
