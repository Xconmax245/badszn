import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import CheckoutPage from "@/components/checkout/CheckoutPage"

export default async function Checkout() {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth?redirect=/checkout")
  }

  return <CheckoutPage />
}
