import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { verifyAdminToken } from '../../../../lib/auth';

export async function POST(request) {
  try {
    await verifyAdminToken(request);
    const { name, email, password } = await request.json();

    // Create the user in Supabase Auth
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });
    if (userError) throw userError;

    // Insert into teachers table (no class anymore – assignments are separate)
    const { error: teacherError } = await supabaseAdmin
      .from('teachers')
      .insert({ id: user.user.id, name });

    if (teacherError) throw teacherError;

    return NextResponse.json({ success: true, teacherId: user.user.id }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}