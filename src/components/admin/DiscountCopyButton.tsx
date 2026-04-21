"use client";

import { useState } from "react";
import { Copy, CheckCircle2 } from "lucide-react";

export function DiscountCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={copyToClipboard}
      className={`p-1.5 rounded-lg transition-all ${copied ? "bg-emerald-500/20 text-emerald-500" : "bg-white/5 text-white/20 hover:text-white"}`}
      data-cursor="hover"
      title="Copy Code"
    >
      {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}
