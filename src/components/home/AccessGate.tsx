"use client";

import { useAuthState } from "@/hooks/useAuthState";

export default function AccessGate() {
  const { isAuthenticated, loading } = useAuthState();

  if (loading || isAuthenticated) return null;

  return (
    <section className="py-20 bg-black flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-4 w-full max-w-md px-6">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
        />
        <button className="w-full bg-white text-black font-black uppercase text-xs tracking-widest py-4 rounded-full hover:bg-white/90 transition-colors">
          Request Access
        </button>
      </div>
    </section>
  );
}
