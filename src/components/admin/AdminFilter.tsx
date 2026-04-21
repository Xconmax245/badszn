"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter, X, ChevronDown } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface Props {
  queryKey: string;
  options: FilterOption[];
  label?: string;
  showClear?: boolean;
}

export function AdminFilter({ queryKey, options, label = "Filter", showClear = true }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSelection = searchParams.get(queryKey) || "";

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

  const handleClearAll = () => {
    router.replace(pathname);
  };

  const activeFiltersCount = Array.from(searchParams.entries()).filter(([k]) => k !== 'page').length;

  return (
    <div className="flex items-center gap-3">
      <div className="relative group">
        <select 
          value={currentSelection}
          onChange={(e) => router.push(`${pathname}?${createQueryString(queryKey, e.target.value)}`, { scroll: false })}
          className="appearance-none bg-white/[0.03] border border-white/10 rounded-full py-3.5 pl-6 pr-12 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 focus:text-white focus:border-white/20 transition-all cursor-pointer glass-aura"
          data-cursor="hover"
        >
          <option value="">{label.toUpperCase()}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-black text-white">
              {opt.label.toUpperCase()}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20 pointer-events-none group-focus-within:rotate-180 transition-transform" />
      </div>

      {showClear && activeFiltersCount > 0 && (
        <button 
          onClick={handleClearAll}
          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all animate-in fade-in slide-in-from-right-4 bg-white/[0.03] px-4 py-3 rounded-full border border-white/[0.05]"
          data-cursor="hover"
          data-magnetic
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      )}
    </div>
  );
}
