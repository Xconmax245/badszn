import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";
import { SupabaseProvider } from "@/components/providers/SupabaseProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BAD SZN — Premium Streetwear",
  description: "Drop-ready. Minimal. Bad Season.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  }
};

import CustomCursor from "@/components/shared/CustomCursor";
import AOSInit from "@/components/shared/AOSInit";
import MaintenanceBarrier from "@/components/shared/MaintenanceBarrier";
import SmoothScroll from "@/components/shared/SmoothScroll";
import { getSiteConfig } from "@/lib/actions/system";
import Footer from "@/components/layout/Footer";
import CartDrawerWrapper from "@/components/cart/CartDrawerWrapper";
import { Toaster } from "sonner"
import VisitorTracker from "@/components/shared/VisitorTracker";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch Site Config (Deduplicated) with defensive fallback
  let config = null;
  try {
    config = await getSiteConfig();
  } catch (error) {
    console.error("CRITICAL: Failed to fetch site config due to connection timeout.", error);
    // Continue with default null config to prevent layout crash
  }

  // Check if we are on an admin route
  const headersList = headers();
  const fullPath = headersList.get("x-pathname") || "";
  const isAdmin = fullPath.startsWith("/admin");
  
  // Activate Maintenance if enabled and not admin
  const showMaintenance = config?.maintenanceMode && !isAdmin;

  // ── Fetch session on server ──────────────────────────────────────
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang="en" className={`${inter.variable} bg-[#0A0A0A]`}>
      <body className="antialiased bg-[#0A0A0A] text-[#F5F5F5] font-sans relative">
        <SupabaseProvider initialSession={session}>
          <SmoothScroll>
            <VisitorTracker />
            <AOSInit />
            <CustomCursor />
            {showMaintenance && <MaintenanceBarrier />}
            <CartDrawerWrapper />
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#0a0a0a",
                  border:     "1px solid rgba(255,255,255,0.08)",
                  color:      "#ffffff",
                  fontSize:   "12px",
                  letterSpacing: "0.05em",
                },
              }}
            />
          </SmoothScroll>
        </SupabaseProvider>
      </body>
    </html>
  );
}
