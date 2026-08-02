import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Paths that require authentication
const protectedPaths = [
  "/dashboard",
  "/workspace",
  "/projects",
  "/learn",
  "/settings",
  "/profile",
  "/checkout",
]

// Auth paths (redirect to dashboard if already signed in)
const authPaths = ["/auth/signin", "/auth/signup", "/auth/error"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuthenticated = !!token

  // If accessing a protected path without auth, redirect to sign-in
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  if (isProtected && !isAuthenticated) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // If accessing auth pages while signed in, redirect to dashboard
  const isAuthPage = authPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files, API routes, and public assets
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}