import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { verifyAdminToken } from '../../../../lib/auth';

export async function POST(request) {
  try {
    await verifyAdminToken(request);
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
    const { error } = await supabaseAdmin
      .from('allowed_users')
      .insert({ email });
    if (error) throw error;
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}