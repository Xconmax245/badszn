"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  X, 
  Plus, 
  Tag, 
  Percent, 
  Naira, // This is just a placeholder icon if needed, but I'll use text
  Calendar,
  Users,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export function CreateDiscountModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    code: "",
    type: "PERCENTAGE",
    value: "",
    expiresAt: "",
    minOrderAmount: "",
    maxUses: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create discount");
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
        router.refresh();
        setFormData({
          code: "",
          type: "PERCENTAGE",
          value: "",
          expiresAt: "",
          minOrderAmount: "",
          maxUses: "",
        });
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-white text-black py-3 px-8 rounded-full flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all"
        data-cursor="hover"
      >
        <Plus className="w-4 h-4" /> Create Code
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            
            {/* Header */}
            <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Tag className="w-5 h-5 text-white/20" />
                <h2 className="text-[14px] font-black uppercase tracking-[0.2em] text-white">Logic Creation</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/20 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3 col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 block">Coupon Code</label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. SOLSTICE_25"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-[13px] text-white focus:border-white/20 focus:bg-white/[0.06] transition-all uppercase placeholder:text-white/5"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>

                <div className="space-y-3 col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 block">Benefit Type</label>
                  <select 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-[13px] text-white focus:border-white/20 focus:bg-white/[0.06] transition-all"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₦)</option>
                    <option value="FREE_SHIPPING">Free Shipping</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 block">
                    {formData.type === "PERCENTAGE" ? "Percentage Value" : formData.type === "FREE_SHIPPING" ? "Logic Override" : "Amount (₦)"}
                  </label>
                  <input 
                    required={formData.type !== "FREE_SHIPPING"}
                    disabled={formData.type === "FREE_SHIPPING"}
                    type="number"
                    placeholder={formData.type === "PERCENTAGE" ? "20" : formData.type === "FREE_SHIPPING" ? "0" : "5000"}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-[13px] text-white focus:border-white/20 focus:bg-white/[0.06] transition-all disabled:opacity-20"
                    value={formData.type === "FREE_SHIPPING" ? "0" : formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 block">Min. Order (₦)</label>
                  <input 
                    type="number"
                    placeholder="None"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-[13px] text-white focus:border-white/20 focus:bg-white/[0.06] transition-all"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 block">Expiration Date</label>
                  <input 
                    type="date"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-[13px] text-white focus:border-white/20 focus:bg-white/[0.06] transition-all [color-scheme:dark]"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 block">Max Uses</label>
                  <input 
                    type="number"
                    placeholder="Infinite"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-[13px] text-white focus:border-white/20 focus:bg-white/[0.06] transition-all"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-[11px] font-bold uppercase tracking-widest animate-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {success ? (
                <div className="w-full py-5 bg-emerald-500 text-black rounded-full flex items-center justify-center gap-3 font-black uppercase text-[11px] tracking-[0.3em] animate-in zoom-in-95">
                  <CheckCircle2 className="w-5 h-5" /> Code Deployed
                </div>
              ) : (
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-white text-black rounded-full flex items-center justify-center gap-3 font-black uppercase text-[11px] tracking-[0.3em] hover:bg-white/90 active:scale-95 transition-all disabled:opacity-50"
                  data-cursor="hover"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize Deployment"}
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
