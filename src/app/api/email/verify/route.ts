import { NextResponse } from "next/server"
import { resend } from "@/lib/resend"
import { verifyEmailTemplate } from "@/lib/emails/verifyEmail"

export async function POST(req: Request) {
  try {
    const { email, name, verifyUrl } = await req.json()

    if (!email || !verifyUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const template = verifyEmailTemplate({ name, verifyUrl })

    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || "BAD SZN <no-reply@badszn.shop>",
      to: email,
      subject: template.subject,
      html: template.html,
    })

    return NextResponse.json({ success: true, id: data.data?.id })
  } catch (error: any) {
    console.error("Email Verification API Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
