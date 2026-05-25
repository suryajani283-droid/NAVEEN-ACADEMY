import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  // Maintenance Mode Check – redirect all non‑admin users to /maintenance
  if (
    !request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/api/admin') &&
    !request.nextUrl.pathname.startsWith('/_next') &&
    !request.nextUrl.pathname.startsWith('/static') &&
    request.nextUrl.pathname !== '/maintenance'
  ) {
    try {
      const maintenanceRes = await fetch(`${request.nextUrl.origin}/api/maintenance`);
      if (maintenanceRes.ok) {
        const { maintenance_mode } = await maintenanceRes.json();
        if (maintenance_mode) {
          return NextResponse.redirect(new URL('/maintenance', request.url));
        }
      }
    } catch {
      // If the API call fails, allow the site to load normally
    }
  }

  // Admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.pathname === '/admin') {
      return NextResponse.next();
    }
    const token = request.cookies.get('adminToken')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // Teacher routes
  if (request.nextUrl.pathname.startsWith('/teacher')) {
    if (request.nextUrl.pathname === '/teacher-login') {
      return NextResponse.next();
    }
    const sessionToken = request.cookies.get('sb-access-token')?.value;
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/teacher-login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/teacher/:path*', '/((?!_next|static|favicon.ico).*)'],
};