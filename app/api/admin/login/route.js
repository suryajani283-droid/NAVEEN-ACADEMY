import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function POST(request) {
  try {
    const { email, password, role, class: teacherClass, name, userId } = await request.json();

    // Teacher login path
    if (role === 'teacher' && userId) {
      // Verify teacher exists in teachers table
      const { data: teacher, error: teacherError } = await supabaseAdmin
        .from('teachers')
        .select('id')
        .eq('id', userId)
        .single();

      if (teacherError || !teacher) {
        return NextResponse.json({ error: 'Invalid teacher record' }, { status: 401 });
      }

      // Generate teacher JWT
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const token = await new SignJWT({
        role: 'teacher',
        class: teacherClass,
        name: name,
        userId,
      })
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

    // Admin login path
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
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}