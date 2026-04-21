import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

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
import MaintenanceBarrier from "@/components/shared/MaintenanceBarrier";
import SmoothScroll from "@/components/shared/SmoothScroll";
import { getSiteConfig } from "@/lib/actions/system";
import Footer from "@/components/layout/Footer";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch Site Config (Deduplicated)
  const config = await getSiteConfig();

  // Check if we are on an admin route
  const headersList = headers();
  const fullPath = headersList.get("x-pathname") || "";
  const isAdmin = fullPath.startsWith("/admin");
  
  // Activate Maintenance if enabled and not admin
  const showMaintenance = config?.maintenanceMode && !isAdmin;

  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-bg-primary text-text-primary font-sans relative">
        <SmoothScroll>
          <AOSInit />
          <CustomCursor />
          {showMaintenance && <MaintenanceBarrier />}
          {children}
          {!isAdmin && <Footer />}
        </SmoothScroll>
      </body>
    </html>
  );
}
