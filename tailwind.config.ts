import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-primary)",
        foreground: "var(--text-primary)",
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "accent-red": "var(--accent-red)",
        "accent-red-hover": "var(--accent-red-hover)",
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",
        "accent-gold": "var(--accent-gold)",
      },
      fontFamily: {
        primary: ['var(--font-sans)', 'sans-serif'],
        display: ['var(--font-sans)', 'sans-serif'],
        sans:    ['var(--font-sans)', 'sans-serif'],
      },
      borderRadius: {
        premium: '2.5rem',
      },
      boxShadow: {
        cinematic: '0 20px 60px rgba(0,0,0,0.5)',
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 18s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
