import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signAdminToken } from "@/lib/auth/sign"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // 1. Find the admin user
    const admin = await prisma.adminUser.findUnique({
      where: { email }
    })

    if (!admin) {
      return NextResponse.json(
        { error: "Access Denied: Invalid credentials." },
        { status: 401 }
      )
    }

    // 2. Verify password
    const isValid = await bcrypt.compare(password, admin.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { error: "Access Denied: Invalid credentials." },
        { status: 401 }
      )
    }

    // 3. Generate JWT
    const token = await signAdminToken({
      id: admin.id,
      email: admin.email,
      role: admin.role
    })

    // 4. Set secure cookie
    const cookieStore = cookies()
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/"
    })

    return NextResponse.json({ success: true, user: { name: admin.name, role: admin.role } })

  } catch (error: any) {
    console.error("Admin Login Error:", error)
    return NextResponse.json(
      { error: "System Error during authentication." },
      { status: 500 }
    )
  }
}
