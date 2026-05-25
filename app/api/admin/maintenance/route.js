import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { verifyAdminToken } from '../../../../lib/auth';

export async function GET(request) {
  try {
    await verifyAdminToken(request);
    const { data, error } = await supabaseAdmin
      .from('homepage_content')
      .select('content')
      .eq('section', 'maintenance_mode')
      .single();
    if (error) throw error;
    return NextResponse.json({ maintenance_mode: data?.content === 'true' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await verifyAdminToken(request);
    const { enabled } = await request.json();
    const { error } = await supabaseAdmin
      .from('homepage_content')
      .update({ content: enabled ? 'true' : 'false' })
      .eq('section', 'maintenance_mode');
    if (error) throw error;
    return NextResponse.json({ success: true, maintenance_mode: enabled });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}