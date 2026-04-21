"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce"; // I'll check if this exists or create it

export function AdminSearch({ placeholder = "Search...", queryKey = "q" }: { placeholder?: string, queryKey?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [value, setValue] = useState(searchParams.get(queryKey) || "");
  const debouncedValue = useDebounce(value, 300);

  const createQueryString = useCallback(
    (name: string, val: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (val) {
        params.set(name, val);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const current = searchParams.get(queryKey) || "";
    if (debouncedValue !== current) {
      router.push(`${pathname}?${createQueryString(queryKey, debouncedValue)}`, { scroll: false });
    }
  }, [debouncedValue, queryKey, pathname, router, searchParams, createQueryString]);

  // Sync state if URL changes externally (e.g. "Clear" button)
  useEffect(() => {
    setValue(searchParams.get(queryKey) || "");
  }, [searchParams, queryKey]);

  return (
    <div className="relative group flex-1">
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
      <input 
        type="text" 
        placeholder={placeholder} 
        className="w-full bg-white/[0.03] border border-white/10 rounded-full py-4 pl-14 pr-12 text-[13px] text-white focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all placeholder:text-white/10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        data-cursor="text"
      />
      {value && (
        <button 
          onClick={() => setValue("")}
          className="absolute right-5 top-1/2 -translate-y-1/2 p-1 text-white/20 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
