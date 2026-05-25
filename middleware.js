import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const pathname = request.nextUrl.pathname

  // Allow admin login page so admins can log in
  if (pathname === '/admin') {
    return NextResponse.next()
  }

  // Allow maintenance page itself
  if (pathname === '/maintenance') {
    return NextResponse.next()
  }

  // Allow API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Allow static assets
  if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.startsWith('/images')) {
    return NextResponse.next()
  }

  // Check if maintenance mode is ON
  try {
    const maintenanceRes = await fetch(`${request.nextUrl.origin}/api/maintenance`)
    if (maintenanceRes.ok) {
      const { maintenance_mode } = await maintenanceRes.json()
      if (maintenance_mode) {
        // If user is admin (has valid adminToken), allow access
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
    }
  } catch {}

  // Normal admin route protection
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