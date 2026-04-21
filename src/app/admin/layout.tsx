import { Metadata } from "next"
import AdminSidebar from "@/components/admin/Sidebar"
import TopBar from "@/components/admin/TopBar"

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard | BAD SZN",
  description: "Brand command center.",
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar — fixed, full height */}
      <AdminSidebar />
 
      {/* Main — offset by sidebar width, browser handles scroll */}
      <div className="lg:pl-[260px] min-h-screen flex flex-col relative bg-[#060606]">
        <TopBar title="Command Center" />
        <main className="flex-1 p-6 md:p-8 relative z-10 transition-all duration-700 ease-in-out">
          {children}
        </main>
      </div>
    </div>
  )
}
