import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
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
  matcher: ['/admin/:path*', '/teacher/:path*'],
};