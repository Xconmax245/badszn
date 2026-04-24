import AuthSplitLayout from "@/components/auth/AuthSplitLayout"
import AdminLoginForm from "@/components/auth/AdminLoginForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portal-7x9 | BAD SZN",
  description: "Secure gateway.",
}

export default function SecretAdminPortalPage() {
  return (
    <AuthSplitLayout quote="The archive remains closed to the uninvited." isAdmin={true}>
      <div className="space-y-12">
        <div className="flex items-center gap-4 px-2">
          <div className="h-[1px] flex-1 bg-white/5" />
          <span className="text-[10px] font-black text-white/30 tracking-[0.4em] uppercase">Admin Login</span>
          <div className="h-[1px] flex-1 bg-white/5" />
        </div>
        <AdminLoginForm />
      </div>
    </AuthSplitLayout>
  )
}
