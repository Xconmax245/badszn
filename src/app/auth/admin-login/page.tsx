import AuthSplitLayout from "@/components/auth/AuthSplitLayout"
import AdminLoginForm from "@/components/auth/AdminLoginForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Restricted | BAD SZN",
  description: "Secure terminal entry.",
}

export default function AdminLoginPage() {
  return (
    <AuthSplitLayout quote="Access isn't given. It's authorized." isAdmin={true}>
      <AdminLoginForm />
    </AuthSplitLayout>
  )
}
