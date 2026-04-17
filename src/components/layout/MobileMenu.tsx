"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  items: NavItem[];
  onClose: () => void;
}

// ─── Premium easing ──────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Component ───────────────────────────────────────────
export default function MobileMenu({ items, onClose }: MobileMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="fixed inset-0 z-40 bg-bg-primary/95 backdrop-blur-2xl flex flex-col items-center justify-center"
    >
      {/* ── Navigation links ─────────────────────── */}
      <nav className="flex flex-col items-center gap-2">
        {items.map((item, i) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.05 + i * 0.06 }}
          >
            <Link
              href={item.href}
              onClick={onClose}
              className="block text-4xl md:text-5xl font-bold tracking-[-0.03em] uppercase text-text-primary/80 hover:text-text-primary transition-colors duration-300 py-3"
            >
              {item.label}
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* ── CTA + Secondary links ────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
        className="mt-12 flex flex-col items-center gap-6"
      >
        <Link
          href="/shop"
          onClick={onClose}
          className="inline-flex items-center px-8 py-3 text-sm font-bold tracking-widest uppercase rounded-full bg-accent-red text-text-primary border border-accent-red transition-all duration-400 hover:bg-accent-red-hover hover:scale-[1.03] active:scale-100"
        >
          Shop Now
        </Link>

        <div className="flex items-center gap-6 text-text-muted text-xs tracking-widest uppercase">
          <Link href="/cart" onClick={onClose} className="hover:text-text-primary transition-colors duration-300">
            Cart
          </Link>
          <span className="w-1 h-1 rounded-full bg-text-muted/30" />
          <Link href="/account" onClick={onClose} className="hover:text-text-primary transition-colors duration-300">
            Account
          </Link>
          <span className="w-1 h-1 rounded-full bg-text-muted/30" />
          <Link href="/search" onClick={onClose} className="hover:text-text-primary transition-colors duration-300">
            Search
          </Link>
        </div>
      </motion.div>

      {/* ── Bottom brand watermark ────────────────── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-8 text-[12vw] font-bold tracking-[-0.05em] uppercase text-text-primary select-none pointer-events-none"
      >
        BADSZN
      </motion.p>
    </motion.div>
  );
}
