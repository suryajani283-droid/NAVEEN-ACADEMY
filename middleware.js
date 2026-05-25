import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const pathname = request.nextUrl.pathname

  // Allow these paths always
  if (
    pathname === '/admin' ||
    pathname === '/maintenance' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/images')
  ) {
    return NextResponse.next()
  }

  // Check maintenance cookie (set by admin panel)
  const maintenanceCookie = request.cookies.get('maintenance_mode')?.value

  if (maintenanceCookie === 'true') {
    // If user is admin, allow access
    const token = request.cookies.get('adminToken')?.value
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        await jwtVerify(token, secret)
        return NextResponse.next()
      } catch {}
    }
    // Everyone else → maintenance page
    return NextResponse.redirect(new URL('/maintenance', request.url))
  }

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('adminToken')?.value
    if (!token) return NextResponse.redirect(new URL('/admin', request.url))
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // Teacher routes
  if (pathname.startsWith('/teacher')) {
    if (pathname === '/teacher-login') return NextResponse.next()
    const sessionToken = request.cookies.get('sb-access-token')?.value
    if (!sessionToken) return NextResponse.redirect(new URL('/teacher-login', request.url))
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico|images).*)'],
}