import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  // केवल /admin वाले रास्तों की जाँच करें
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // लॉगिन पेज (/admin) को छोड़ दें, नहीं तो लूप बनेगा
    if (request.nextUrl.pathname === '/admin') {
      return NextResponse.next();
    }

    const token = request.cookies.get('adminToken')?.value;

    // टोकन मौजूद नहीं – लॉगिन पर भेजें
    if (!token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      // टोकन सही है, पेज खुलने दें
      return NextResponse.next();
    } catch (err) {
      // टोकन खराब या एक्सपायर – लॉगिन पर भेजें
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // बाकी सब रास्तों को बिना रोक-टोक जाने दें
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
