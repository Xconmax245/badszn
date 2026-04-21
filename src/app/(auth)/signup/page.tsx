import AuthSplitLayout from "@/components/auth/AuthSplitLayout"
import SignupForm from "@/components/auth/SignupForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Get Access | BAD SZN",
  description: "Join the waitlist. Step inside BAD SZN.",
}

export default function SignupPage() {
  return (
    <AuthSplitLayout 
      quote="You don't just wear it." 
      bgImage="/images/photo_5994565660274527449_x.jpg"
    >
      <SignupForm />
    </AuthSplitLayout>
  )
}
