const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!

export async function initializePayment({
  email,
  amount,
  reference,
  callback_url,
}: {
  email: string
  amount: number // in kobo
  reference: string
  callback_url: string
}) {
  if (!PAYSTACK_SECRET) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured")
  }

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount,
      reference,
      callback_url,
    }),
  })

  const data = await res.json()

  if (!data.status) {
    console.error("Paystack Init Error:", data)
    throw new Error(data.message || "Payment initialization failed")
  }

  return data.data.authorization_url
}
