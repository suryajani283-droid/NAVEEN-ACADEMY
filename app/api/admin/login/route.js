import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, role, class: teacherClass, name, userId } = body;

    // Teacher login
    if (role === 'teacher' && userId) {
      const { data: teacher, error: teacherError } = await supabaseAdmin
        .from('teachers')
        .select('id')
        .eq('id', userId)
        .single();

      if (teacherError || !teacher) {
        return NextResponse.json({ error: 'Invalid teacher record' }, { status: 401 });
      }

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

      const response = NextResponse.json({ success: true, token });
      response.cookies.set('adminToken', token, {
        httpOnly: false,   // allow JavaScript to read it for debugging
        secure: true,
        sameSite: 'strict',
        maxAge: 86400,
        path: '/',
      });
      return response;
    }

    // Admin login
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(secret);

    const response = NextResponse.json({ success: true, token });
    response.cookies.set('adminToken', token, {
      httpOnly: false,
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