import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { verifyAdminToken } from '../../../../lib/auth';

export async function POST(request) {
  try {
    await verifyAdminToken(request);
    const { phone } = await request.json();
    if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 });
    const { error } = await supabaseAdmin
      .from('allowed_mobiles')
      .insert({ phone });
    if (error) throw error;
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}