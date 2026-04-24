import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Pass the current pathname to headers so it can be read in server components
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", pathname)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n) => request.cookies.get(n)?.value } }
  )
  const { data: { session } } = await supabase.auth.getSession()
  
  // Whitelist exact public paths
  const PUBLIC_PATHS = [
    "/auth/verify-email",
    "/auth/callback",
    "/auth/success"
  ]
  const isPublicPath = PUBLIC_PATHS.some(path => pathname === path)

  // 1. Logged-in users cannot visit auth pages
  const authRoutes = ["/login", "/register", "/signup", "/auth", "/forgot-password"]
  if (session && !isPublicPath && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // 2. Admin route protection ──────────────────
  if (pathname.startsWith("/admin")) {
    const adminToken = request.cookies.get("admin_token")?.value

    if (!adminToken) {
      // Ruthless: Redirect unauthorized attempts to the specialized admin login
      return NextResponse.redirect(new URL("/auth/admin-login", request.url))
    }

    try {
      const { verifyAdminToken } = await import("@/lib/auth/admin")
      await verifyAdminToken(adminToken)
    } catch {
      return NextResponse.redirect(new URL("/auth/admin-login", request.url))
    }
  }

  // Secret Admin Portal Entry
  if (pathname === "/admin-portal-7x9") {
    // If already logged in, go straight to dashboard
    const adminToken = request.cookies.get("admin_token")?.value
    if (adminToken) {
      try {
        const { verifyAdminToken } = await import("@/lib/auth/admin")
        await verifyAdminToken(adminToken)
        return NextResponse.redirect(new URL("/admin", request.url))
      } catch {
        // Continue to portal if token invalid
      }
    }
  }

  // 3. Customer account protection ─────────────
  if (pathname.startsWith("/account")) {
    if (!session) {
      const loginUrl = new URL("/auth", request.url)
      loginUrl.searchParams.set("redirectTo", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Never redirect /auth itself — prevents infinite loop
  if (pathname === "/auth") return response

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
