import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const DASHBOARD_PREFIX = "/(dashboard)"
const AUTH_PATHS = ["/login", "/register"]
const API_PREFIX = "/api"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value

  const isDashboard = pathname.startsWith("/overview") || pathname.startsWith("/apps") || pathname.startsWith("/databases") || pathname.startsWith("/redis") || pathname.startsWith("/storage") || pathname.startsWith("/dns") || pathname.startsWith("/webhooks") || pathname.startsWith("/cli-auth") || pathname.startsWith("/email") || pathname.startsWith("/caddy") || pathname.startsWith("/orgs") || pathname.startsWith("/api-keys") || pathname.startsWith("/billing") || pathname.startsWith("/settings")
  const isAuthPage = AUTH_PATHS.includes(pathname)
  const isApiRoute = pathname.startsWith(API_PREFIX)

  if (isApiRoute) {
    const response = NextResponse.next()
    response.headers.set("X-Robots-Tag", "noindex")
    return response
  }

  if (isDashboard && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/overview", request.url))
  }

  const response = NextResponse.next()
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$|.*\\.svg$).*)",
  ],
}
