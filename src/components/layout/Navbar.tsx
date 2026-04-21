"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

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
}: {
  items: NavItem[];
  onClose: () => void;
  pathname: string;
}) => {

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
            href="/account"
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
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CartIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const AccountIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ─── Navbar ───────────────────────────────────────────────
export default function Navbar({ announcement }: { announcement?: string | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Sync auth state
  useEffect(() => {
    const supabase = createClient();
    
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
    router.refresh();
    router.push("/");
  };

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

  // Close dropdown on click outside
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = () => setUserMenuOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [userMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed top-0 left-0 w-full z-50 flex justify-center px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-5"
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
              <button
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
              </button>
            </div>

            <div
              className="relative hidden md:flex"
              onMouseEnter={() => setHoveredKey("cart")}
              onMouseLeave={() => setHoveredKey(null)}
              data-cursor="hover"
            >
              <button
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
                <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full bg-red-500 border border-black" />
              </button>
            </div>

            {/* ─── QUIET ENTRY AUTH ─── */}
            <div className="relative ml-8 mr-2 hidden lg:block">
              {user ? (
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserMenuOpen(!userMenuOpen);
                    }}
                    className="text-[13px] font-medium text-white/70 hover:text-white transition-colors duration-150 flex items-center gap-2"
                    data-cursor="hover"
                  >
                    {user.user_metadata?.first_name || "Account"}
                    <motion.span
                      animate={{ rotate: userMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[8px] opacity-30"
                    >
                      ▼
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 mt-4 w-48 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1.5"
                      >
                        <div className="px-4 py-2 mb-1">
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Identity</p>
                          <p className="text-[11px] font-medium text-white/40 truncate">{user.email}</p>
                        </div>
                        
                        {[
                          { label: "Account", href: "/account" },
                          { label: "Orders", href: "/account/orders" },
                          { label: "Settings", href: "/account/settings" },
                        ].map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block w-full text-left px-4 py-2.5 text-[12px] font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                          >
                            {link.label}
                          </Link>
                        ))}
                        
                        <div className="h-[1px] bg-white/5 my-1.5 mx-2" />
                        
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2.5 text-[12px] font-medium text-red-500/70 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                        >
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="text-[13px] font-medium text-white/70 hover:text-white transition-colors duration-150"
                  data-cursor="hover"
                >
                  Sign in
                </Link>
              )}
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
              aria-label="Cart"
              className="relative md:hidden flex items-center justify-center w-9 h-9 rounded-full text-white/70 hover:text-white transition-colors"
              data-cursor="hover"
            >
              <CartIcon />
              <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full bg-red-500 border border-black" />
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
          />
        )}
      </AnimatePresence>
    </>
  );
}