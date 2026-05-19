import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request) {
  const { password } = await request.json();
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(secret);
  const response = NextResponse.json({ success: true });
  response.cookies.set('adminToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 86400,
    path: '/',
  });
  return response;
}
