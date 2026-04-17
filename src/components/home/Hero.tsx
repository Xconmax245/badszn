"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

// ─── Premium easing ──────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  // ─── Scroll-driven parallax values (AMPLIFIED) ─────────
  const { scrollY } = useScroll();
  const backTextY = useTransform(scrollY, [0, 500], [0, -250]);
  const modelY = useTransform(scrollY, [0, 500], [0, -380]);
  const frontY = useTransform(scrollY, [0, 500], [0, -520]);
  const circleScale = useTransform(scrollY, [0, 500], [1, 1.5]);
  const grainOpacity = useTransform(scrollY, [0, 500], [0.12, 0.25]);

  // ─── Mouse tilt for 3D depth (desktop) ─────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 30 });

  const backTiltX = useTransform(smoothX, (v) => v * 0.3);
  const modelTiltX = useTransform(smoothX, (v) => v * 0.6);
  const frontTiltX = useTransform(smoothX, (v) => v * 1.0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 24;
    const y = (e.clientY / window.innerHeight - 0.5) * 24;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // ─── Text reveal state ─────────────────────────────────
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: "var(--accent-red)" }}
    >
      {/* ═══════════════════════════════════════════════════
          LAYER 1 — Deep red background + subtle noise grain
          ═══════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* ═══════════════════════════════════════════════════
          LAYER 2 — Background typography "BAD" / "SZN"
          Moves SLOWER than scroll → feels further away
          ═══════════════════════════════════════════════════ */}
      <motion.div
        className="absolute inset-0 flex items-center justify-between px-[2%] md:px-[5%] lg:px-[8%] pointer-events-none z-[5]"
        style={{ y: backTextY, x: backTiltX }}
      >
        {/* "BAD" — left side */}
        <motion.span
          initial={{ opacity: 0, y: 80 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, ease: EASE, delay: 0.3 }}
          className="text-[26vw] md:text-[20vw] lg:text-[18vw] font-black leading-none tracking-[-0.06em] uppercase select-none"
          style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            color: "rgba(255,255,255,0.06)",
            WebkitTextStroke: "1px rgba(255,255,255,0.04)",
          }}
        >
          BAD
        </motion.span>

        {/* "SZN" — right side */}
        <motion.span
          initial={{ opacity: 0, y: 80 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, ease: EASE, delay: 0.5 }}
          className="text-[26vw] md:text-[20vw] lg:text-[18vw] font-black leading-none tracking-[-0.06em] uppercase select-none"
          style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            color: "rgba(255,255,255,0.06)",
            WebkitTextStroke: "1px rgba(255,255,255,0.04)",
          }}
        >
          SZN
        </motion.span>
      </motion.div>

      {/* ═══════════════════════════════════════════════════
          LAYER 2.5 — Subtle circle behind the model
          Scales on scroll for depth
          ═══════════════════════════════════════════════════ */}
      <motion.div
        className="absolute z-[8] pointer-events-none"
        style={{ scale: circleScale }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
          className="w-[55vw] h-[55vw] md:w-[38vw] md:h-[38vw] rounded-full border border-white/[0.06]"
          style={{
            boxShadow: "inset 0 0 100px rgba(0,0,0,0.25), 0 0 60px rgba(139,0,0,0.15)",
          }}
        />
      </motion.div>

      {/* ═══════════════════════════════════════════════════
          LAYER 3 — Model cutout PNG (THE ANCHOR LAYER)
          Background-removed image sits BETWEEN the text
          ═══════════════════════════════════════════════════ */}
      <motion.div
        className="relative z-10 w-[92%] max-w-lg md:max-w-3xl lg:max-w-4xl aspect-[3/4]"
        style={{ y: modelY, x: modelTiltX }}
        initial={{ opacity: 0, scale: 0.88 }}
        animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
      >
        <Image
          src="/images/photo_5981053800535493916_y-removebg-preview.png"
          alt="BAD SZN — Latest drop streetwear"
          fill
          priority
          className="object-contain object-center drop-shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          sizes="(max-width: 768px) 92vw, 1000px"
        />
      </motion.div>

      {/* ═══════════════════════════════════════════════════
          LAYER 4 — Foreground: Corner labels + CTA
          Moves FASTEST on scroll → feels closest
          ═══════════════════════════════════════════════════ */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{ y: frontY, x: frontTiltX }}
      >
        {/* Top-left corner label */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={isLoaded ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
          className="absolute top-28 md:top-36 left-8 md:left-16 text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase text-white/40"
        >
          2026 Case
        </motion.p>

        {/* Top-right corner label */}
        <motion.p
          initial={{ opacity: 0, x: 20 }}
          animate={isLoaded ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.75 }}
          className="absolute top-28 md:top-36 right-8 md:right-16 text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase text-white/40 text-right"
        >
          Unisex Streetwear
        </motion.p>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.85 }}
          className="absolute bottom-12 md:bottom-16 left-0 w-full flex flex-col items-center gap-5 pointer-events-auto"
        >
          <p className="text-white/50 text-[10px] md:text-xs tracking-[0.25em] uppercase font-medium">
            New Drop — Available Now
          </p>
          <a
            href="/shop"
            className="inline-flex items-center px-8 py-3 text-xs md:text-sm font-bold tracking-widest uppercase rounded-none bg-text-primary text-bg-primary border border-text-primary transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-accent-red-hover hover:border-accent-red-hover hover:text-text-primary hover:scale-[1.02] active:scale-100 will-change-transform cursor-pointer"
            data-cursor="hover"
          >
            Shop Now
          </a>
        </motion.div>

        {/* Bottom-left edition label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.9 }}
          className="absolute bottom-6 left-6 md:left-12 text-[9px] tracking-[0.15em] uppercase text-white/20 font-medium"
        >
          Vol. 01
        </motion.p>

        {/* Bottom-right scroll hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.95 }}
          className="absolute bottom-6 right-6 md:right-12 text-[9px] tracking-[0.15em] uppercase text-white/20 font-medium"
        >
          Scroll ↓
        </motion.p>
      </motion.div>

      {/* ═══════════════════════════════════════════════════
          LAYER 5 — Grain overlay (fixed, always on top)
          ═══════════════════════════════════════════════════ */}
      <motion.div
        className="absolute inset-0 z-40 pointer-events-none mix-blend-multiply"
        style={{
          opacity: grainOpacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 z-[39] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </section>
  );
}
