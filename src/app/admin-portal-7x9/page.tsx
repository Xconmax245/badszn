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
          <div className="h-[1px] flex-1 bg-red-500/20" />
          <span className="text-[10px] font-black text-red-500 tracking-[0.4em] uppercase">Gateway_Verified</span>
          <div className="h-[1px] flex-1 bg-red-500/20" />
        </div>
        <AdminLoginForm />
      </div>
    </AuthSplitLayout>
  )
}
