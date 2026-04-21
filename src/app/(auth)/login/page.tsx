import AuthSplitLayout from "@/components/auth/AuthSplitLayout"
import LoginForm from "@/components/auth/LoginForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vault | BAD SZN",
  description: "Secure terminal entry.",
}

export default function LoginPage() {
  return (
    <AuthSplitLayout 
      quote="Not for everyone." 
      bgImage="/images/photo_5994565660274527448_x.jpg"
    >
      <LoginForm />
    </AuthSplitLayout>
  )
}
