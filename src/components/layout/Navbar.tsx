"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { UserMenu } from "./UserMenu";
import { useUser } from "@/hooks/useUser";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "About", href: "/about" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Mobile Menu ──────────────────────────────────────────
const MobileMenu = ({
  items,
  onClose,
  pathname,
  isAuthenticated,
}: {
  items: NavItem[];
  onClose: () => void;
  pathname: string;
  isAuthenticated: boolean;
}) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col px-6 pt-24 pb-10 overflow-y-auto"
    >
      {/* Nav links */}
      <nav className="flex flex-col flex-1">
        {items.map((item, i) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.06 + i * 0.07,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center justify-between
                  py-5 border-b border-white/[0.07]
                  text-[clamp(1.75rem,8vw,3rem)] font-black tracking-[-0.03em] uppercase
                  transition-colors duration-200
                  ${isActive ? "text-white" : "text-white/35 hover:text-white"}
                `}
                data-cursor="hover"
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="mobileActiveDot"
                    className="w-2.5 h-2.5 rounded-full bg-white flex-shrink-0"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}

        {/* STEP 5: Sign Out in Mobile Menu */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={async () => {
                const supabase = getSupabaseBrowserClient()
                const { error } = await supabase.auth.signOut()
                if (error) {
                  console.error("Sign out failed:", error)
                  return
                }
                onClose()
                router.push("/")
                router.refresh()
              }}
              className="
                w-full text-left
                py-5 border-b border-white/[0.07]
                text-[clamp(1.75rem,8vw,3rem)] font-black
                tracking-[-0.03em] uppercase
                text-white/20 hover:text-white/40
                transition-colors duration-200
              "
            >
              Sign Out
            </button>
          </motion.div>
        )}
      </nav>

      {/* Bottom CTA block */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-3 mt-10"
      >
        <Link
          href="/shop"
          onClick={onClose}
          className="w-full flex items-center justify-center py-4 rounded-full bg-white text-black text-sm font-black tracking-[0.18em] uppercase transition-opacity duration-200 hover:opacity-90 active:scale-[0.98]"
          data-cursor="hover"
        >
          Shop Now
        </Link>
        <div className="flex gap-3">
          <Link
            href={isAuthenticated ? "/account" : "/auth"}
            onClick={onClose}
            className="flex-1 flex items-center justify-center py-3.5 rounded-full border border-white/[0.12] text-white/60 text-xs font-bold tracking-[0.15em] uppercase hover:border-white/30 hover:text-white transition-all duration-200"
            data-cursor="hover"
          >
            Account
          </Link>
          <Link
            href="/cart"
            onClick={onClose}
            className="flex-1 flex items-center justify-center py-3.5 rounded-full border border-white/[0.12] text-white/60 text-xs font-bold tracking-[0.15em] uppercase hover:border-white/30 hover:text-white transition-all duration-200"
            data-cursor="hover"
          >
            Cart
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── SVG Icons ────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const CartIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const AccountIcon = ({ active, user }: { active?: boolean; user?: any }) => {
  return null; // No longer used in desktop, kept for mobile if needed
};

// ─── Navbar ───────────────────────────────────────────────
export default function Navbar({ announcement }: { announcement?: string | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const { toggleCart, itemCount } = useCartStore();
  const cartCount = itemCount();
  const { user, isLoading } = useUser();
  const isAuthenticated = !!user;

  // Hydration guard
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);


  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed left-0 w-full z-50 flex justify-center px-3 sm:px-4 md:px-6 transition-all duration-500 top-3 sm:pt-4 md:pt-5"
      >
        <nav
          className={`
            relative flex items-center justify-between w-full max-w-6xl
            px-4 sm:px-5 md:px-6
            py-2.5 sm:py-3
            rounded-full overflow-visible
            border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${
              scrolled
                ? "bg-black/65 backdrop-blur-2xl border-white/10 shadow-[0_4px_40px_rgba(0,0,0,0.6)]"
                : "bg-white/[0.03] backdrop-blur-xl border-white/[0.06]"
            }
          `}
        >
          {/* Logo */}
          <Link href="/" className="relative z-10 flex-shrink-0">
            <motion.span
              className="text-white font-black uppercase select-none tracking-[-0.04em] text-base sm:text-lg md:text-xl"
              transition={{ duration: 0.2 }}
              data-cursor="hover"
            >
              BAD SZN
            </motion.span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const isHovered = hoveredKey === item.href;

              return (
                <div
                  key={item.href}
                  className="relative flex items-center justify-center transition-all duration-300"
                  onMouseEnter={() => setHoveredKey(item.href)}
                  onMouseLeave={() => setHoveredKey(null)}
                  data-cursor="hover"
                >
                  <Link
                    href={item.href}
                    className={`
                      relative px-5 py-2
                      text-[13px] font-medium tracking-[0.06em] uppercase
                      transition-colors duration-300
                      ${isActive ? "text-white" : "text-white/50 hover:text-white"}
                    `}
                  >
                    {isHovered && (
                      <motion.div
                        layoutId="nav-hover-pill"
                        className="absolute inset-0 z-0 bg-white/[0.06] border border-white/[0.08] rounded-full"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activeNavPill"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2.5px] rounded-full bg-white"
                        transition={{ duration: 0.3, ease: EASE }}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5">
            <div
              className="relative hidden md:flex"
              onMouseEnter={() => setHoveredKey("search")}
              onMouseLeave={() => setHoveredKey(null)}
              data-cursor="hover"
            >
              <Link
                href="/search"
                aria-label="Search"
                className="relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full text-white/50 hover:text-white transition-all duration-300 hover:scale-110"
              >
                {hoveredKey === "search" && (
                  <motion.div
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 z-0 bg-white/[0.06] border border-white/[0.08] rounded-full"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <SearchIcon />
              </Link>
            </div>

            <div
              className="relative hidden md:flex"
              onMouseEnter={() => setHoveredKey("cart")}
              onMouseLeave={() => setHoveredKey(null)}
              data-cursor="hover"
            >
              <button
                onClick={toggleCart}
                aria-label="Cart"
                className="relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full text-white/50 hover:text-white transition-all duration-300 hover:scale-110"
              >
                {hoveredKey === "cart" && (
                  <motion.div
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 z-0 bg-white/[0.06] border border-white/[0.08] rounded-full"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <CartIcon />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[8px] font-black text-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            </div>

            <div className="hidden md:flex ml-1">
              <UserMenu />
            </div>

            <div
              className="relative hidden md:flex ml-1"
              onMouseEnter={() => setHoveredKey("shopnow")}
              onMouseLeave={() => setHoveredKey(null)}
              data-cursor="hover"
            >
              <Link
                href="/shop"
                className="
                  relative
                  inline-flex items-center justify-center
                  px-5 lg:px-6 py-2 lg:py-2.5
                  text-[11px] lg:text-[12px] font-black tracking-[0.18em] uppercase
                  rounded-full bg-red-600 text-white border border-red-600
                  transition-all duration-300
                  hover:bg-red-500 hover:border-red-500 hover:scale-[1.03]
                  active:scale-100 will-change-transform overflow-hidden
                "
              >
                {hoveredKey === "shopnow" && (
                  <motion.div
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 z-0 bg-white/[0.1] rounded-full"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">Shop Now</span>
              </Link>
            </div>

            <button
              onClick={toggleCart}
              aria-label="Cart"
              className="relative md:hidden flex items-center justify-center w-9 h-9 rounded-full text-white/70 hover:text-white transition-colors"
              data-cursor="hover"
            >
              <CartIcon />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[8px] font-black text-white">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="lg:hidden flex flex-col items-center justify-center w-9 h-9 gap-[5px] rounded-full hover:bg-white/[0.05] transition-all duration-300 ml-0.5"
              data-cursor="hover"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="block w-[18px] h-[1.5px] bg-white origin-center"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="block w-[18px] h-[1.5px] bg-white origin-center"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="block w-[18px] h-[1.5px] bg-white origin-center"
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            items={NAV_ITEMS}
            onClose={() => setMobileOpen(false)}
            pathname={pathname}
            isAuthenticated={isAuthenticated}
          />
        )}
      </AnimatePresence>
    </>
  );
}