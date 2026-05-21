import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { verifyAdminToken } from '../../../../lib/auth';

export async function POST(request) {
  try {
    await verifyAdminToken(request);
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    // 1. Check if user already exists in Auth
    const { data: existingUsers, error: findError } = await supabaseAdmin.auth.admin.listUsers();
    if (findError) throw findError;
    const userExists = existingUsers.users.some(user => user.email === email);

    // 2. If not exists, create the user via Admin API (email + temp password, later they can set password)
    if (!userExists) {
      const { error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,      // email already confirmed (no need to verify)
        password: 'Temp@1234',    // temporary password (they can change later)
        user_metadata: { invited: true },
      });
      if (createError) throw createError;
    }

    // 3. Insert into allowed_users table
    const { error: insertError } = await supabaseAdmin
      .from('allowed_users')
      .insert({ email });
    if (insertError && insertError.code !== '23505') { // 23505 = duplicate key (already exists)
      throw insertError;
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}