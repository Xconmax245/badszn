"use client"

import { useRef } from "react"
import Link from "next/link"
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"
import SectionDivider from "@/components/shared/SectionDivider"

// ── Edit copy here only ───────────────────────
const ETHOS_LINES = [
  "Built for the ones",
  "who don't wait",
  "for permission.",
]

const WORDS = ETHOS_LINES.flatMap((line) =>
  line.split(" ").map((word) => word)
)

const EASE = [0.22, 1, 0.36, 1] as const

// ── Single animated word ──────────────────────
function AnimatedWord({
  word,
  scrollYProgress,
  start,
  end,
}: {
  word:            string
  scrollYProgress: MotionValue<number>
  start:           number
  end:             number
}) {
  const opacity = useTransform(scrollYProgress, [start, end], [0.08, 1])
  const blur    = useTransform(scrollYProgress, [start, end], [2, 0])

  return (
    <motion.span
      style={{
        opacity,
        filter: useTransform(blur, (v) => `blur(${v}px)`),
      }}
      className="
        inline-block mr-[0.25em]
        text-[clamp(2.2rem,6.5vw,5.5rem)]
        font-black tracking-[-0.03em] uppercase text-white
        leading-[1.15] will-change-[opacity,filter]
      "
    >
      {word}
    </motion.span>
  )
}

// ── Main content ──────────────────────────────
function EthosContent() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Background "BAD" watermark drift
  const watermarkOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.03, 0.02])
  const watermarkX       = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"])

  // Thin line that draws across
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"])

  // Build word index map per line
  let globalWordIndex = 0

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: "115vh" }}
    >
      <div className="
        sticky top-0 w-full h-screen
        flex flex-col items-start justify-center
        px-8 md:px-16 lg:px-24 xl:px-32
        overflow-hidden
      ">
        {/* Eyebrow label */}
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="
            block mb-4 md:mb-6
            text-[10px] font-bold tracking-[0.35em] uppercase
            text-white/30
          "
        >
          The Ethos
        </motion.span>

        {/* Statement — line by line */}
        <div className="relative z-10 max-w-[900px]">
          {ETHOS_LINES.map((line, lineIndex) => {
            const words = line.split(" ")

            return (
              <div
                key={lineIndex}
                className="mb-2 md:mb-3"
              >
                {words.map((word, wordIndex) => {
                  const thisGlobalIndex = ETHOS_LINES
                    .slice(0, lineIndex)
                    .reduce((acc, l) => acc + l.split(" ").length, 0) + wordIndex

                  const totalWords = WORDS.length
                  const start = (thisGlobalIndex / totalWords) * 0.6
                  const end   = start + 0.15

                  return (
                    <AnimatedWord
                      key={`${lineIndex}-${wordIndex}`}
                      word={word}
                      scrollYProgress={scrollYProgress}
                      start={Math.min(start, 0.85)}
                      end={Math.min(end, 1)}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Animated underline */}
        <motion.div
          className="h-[1px] bg-white/10 mt-6 md:mt-8"
          style={{ width: lineWidth }}
        />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="mt-6 md:mt-10 self-end relative z-10"
        >
          <Link
            href="/about"
            className="
              group inline-flex items-center gap-3
              text-[11px] font-bold tracking-[0.2em] uppercase
              text-white/25 hover:text-white/60
              transition-colors duration-500
            "
          >
            Our Story
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </motion.div>

        {/* Ghost watermark */}
        <motion.span
          aria-hidden
          className="
            absolute right-4 md:right-12 top-1/2 -translate-y-1/2
            text-[18vw] font-black tracking-[-0.06em] uppercase
            text-white select-none pointer-events-none leading-none
          "
          style={{
            opacity: watermarkOpacity,
            x: watermarkX,
          }}
        >
          BAD
        </motion.span>
      </div>
    </div>
  )
}

// ── Export ─────────────────────────────────────
export default function BrandEthos() {
  return (
    <section className="relative w-full bg-black overflow-hidden">
      <EthosContent />
      <SectionDivider variant="wave" fill="#000" />
    </section>
  )
}
