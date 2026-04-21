"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import SectionDivider from "@/components/shared/SectionDivider";

const STATEMENTS = [
  "Worn by the few",
  "Built in silence",
  "No restocks",
  "Drop culture",
  "Since day one",
];

// Utility to cleanly bounce the position back across the threshold for infinite scrolling
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

// ─── Highly Dynamic Velocity Marquee Row ────────────────────
function ParallaxText({ children, baseVelocity = 2 }: { children: React.ReactNode; baseVelocity: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  // Smooth the raw scroll velocity to prevent erratic jitters
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  // Convert smooth velocity into a speed multiplier
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  // Extra interesting touch: As you scroll fast, the entire strip physically leans forward!
  const skewX = useTransform(smoothVelocity, [-1000, 0, 1000], [-15, 0, 15]);

  const directionFactor = useRef<number>(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(wrap(-50, 0, baseX.get() + moveBy));
  });

  return (
    <div className="flex whitespace-nowrap overflow-hidden py-4">
      <motion.div
        className="flex whitespace-nowrap flex-nowrap w-max"
        style={{ x: useTransform(baseX, (v) => `${v}%`), skewX }}
      >
        {/* We use two sets of children padded identically to seamlessly scroll one visual length */}
        <div className="flex items-center gap-8 md:gap-16 pr-8 md:pr-16">{children}</div>
        <div className="flex items-center gap-8 md:gap-16 pr-8 md:pr-16">{children}</div>
      </motion.div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────
export default function PresenceStrip({ narrative }: { narrative?: string | null }) {
  // Use narrative if provided, otherwise fallback to defaults
  const statements = narrative 
    ? narrative.split(/[.;]|\n/).filter(s => s.trim().length > 3).map(s => s.trim())
    : STATEMENTS;

  return (
    <section className="relative w-full bg-black py-16 md:py-24 overflow-hidden">
      {/* Dynamic Text Row Container */}
      <div className="w-full flex items-center justify-center border-y border-white/[0.08] py-8 md:py-10 bg-black/60 shadow-2xl skew-y-[-2deg] origin-center -mx-4 w-[110%] relative z-10">
        <ParallaxText baseVelocity={-1.5}>
          {statements.map((text, i) => {
            // Alternate styles dynamically so all platforms experience the aesthetic without hover!
            const styleVariant = i % 3;
            // 0: Solid White
            // 1: Hollow Outline
            // 2: Solid Red Italic
            let typographyClass = "text-white";
            let inlineStyle = {};
            
            if (styleVariant === 1) {
              typographyClass = "text-transparent";
              inlineStyle = { WebkitTextStroke: "1px rgba(255,255,255,0.4)" };
            } else if (styleVariant === 2) {
              typographyClass = "text-accent-red italic";
            }

            return (
              <div key={`${text}-${i}`} className="flex items-center gap-8 md:gap-16">
                <span 
                  className={`
                    text-5xl md:text-7xl lg:text-8xl 
                    font-black uppercase tracking-[-0.04em]
                    ${typographyClass}
                  `}
                  style={inlineStyle}
                >
                  {text}
                </span>
                <span className="text-3xl md:text-4xl text-white/20 animate-pulse select-none">✦</span>
              </div>
            );
          })}
        </ParallaxText>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none z-[15]" />

      {/* Section divider to seamlessly mask into next section */}
      <div className="absolute bottom-[-1px] left-0 w-full z-0 pointer-events-none leading-[0]">
        <SectionDivider variant="slash" fill="var(--bg-primary)" background="transparent" />
      </div>
    </section>
  );
}
