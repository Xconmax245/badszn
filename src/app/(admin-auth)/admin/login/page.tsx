import AuthSplitLayout from "@/components/auth/AuthSplitLayout"
import AdminLoginForm from "@/components/auth/AdminLoginForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin | BAD SZN",
  description: "Secure terminal entry.",
}

export default function AdminLoginPage() {
  return (
    <AuthSplitLayout quote="Access isn't given." isAdmin={true}>
      <AdminLoginForm />
    </AuthSplitLayout>
  )
}
