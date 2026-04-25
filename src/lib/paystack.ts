const PAYSTACK_SECRET = (process.env.PAYSTACK_SECRET_KEY || "").trim().replace(/^["']|["']$/g, "")

export async function initializePayment({
  email,
  amount,
  reference,
  metadata,
  callback_url
}: {
  email: string
  amount: number // in kobo
  reference: string
  callback_url: string
  metadata?: any
}) {
  console.log("💳 Paystack Init Attempt:", {
    email,
    amount,
    key_prefix: PAYSTACK_SECRET.substring(0, 7),
    key_suffix: PAYSTACK_SECRET.slice(-4),
    key_length: PAYSTACK_SECRET.length
  })

  if (!PAYSTACK_SECRET) {
    throw new Error("PAYSTACK_SECRET_KEY is missing from environment variables")
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
      metadata,
    }),
  })

  const data = await res.json()

  if (!data.status) {
    console.error("Paystack Init Error:", data)
    throw new Error(data.message || "Payment initialization failed")
  }

  return data.data.authorization_url
}
