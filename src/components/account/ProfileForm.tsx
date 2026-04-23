"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { updateProfile } from "@/lib/actions/customer";

interface ProfileFormProps {
  initialData: {
    firstName: string;
    lastName: string;
    username: string;
    phone: string | null;
    email: string;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: initialData.firstName,
    lastName: initialData.lastName,
    username: initialData.username,
    phone: initialData.phone || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="w-full max-w-2xl space-y-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* First Name */}
        <div className="space-y-2 group">
          <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold group-focus-within:text-white/60 transition-colors">
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full bg-transparent border-b border-white/10 py-3 text-sm font-medium focus:outline-none focus:border-white transition-all tracking-tight"
            required
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2 group">
          <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold group-focus-within:text-white/60 transition-colors">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full bg-transparent border-b border-white/10 py-3 text-sm font-medium focus:outline-none focus:border-white transition-all tracking-tight"
            required
          />
        </div>

        {/* Username */}
        <div className="space-y-2 group">
          <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold group-focus-within:text-white/60 transition-colors">
            Username
          </label>
          <div className="relative">
            <span className="absolute left-0 top-3 text-white/20 text-sm">@</span>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-transparent border-b border-white/10 py-3 pl-5 text-sm font-medium focus:outline-none focus:border-white transition-all tracking-tight"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2 group">
          <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold group-focus-within:text-white/60 transition-colors">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-transparent border-b border-white/10 py-3 text-sm font-medium focus:outline-none focus:border-white transition-all tracking-tight"
            placeholder="N/A"
          />
        </div>
      </div>

      {/* Email (Read Only) */}
      <div className="space-y-2 opacity-50">
        <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">
          Account Email
        </label>
        <p className="py-3 text-sm font-medium border-b border-white/5 text-white/40">
          {initialData.email}
        </p>
      </div>

      <div className="pt-8">
        <button
          type="submit"
          disabled={loading}
          className="relative group w-full md:w-auto px-12 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          <span className="relative z-10">{loading ? "Saving..." : "Save Changes"}</span>
          <div className="absolute inset-0 bg-white/10 -translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </button>
      </div>
    </motion.form>
  );
}
