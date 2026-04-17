import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BAD SZN — Premium Streetwear",
  description: "Drop-ready. Minimal. Bad Season.",
};

import CustomCursor from "@/components/shared/CustomCursor";
import AOSInit from "@/components/shared/AOSInit";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-bg-primary text-text-primary font-sans relative">
        <AOSInit />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
