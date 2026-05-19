import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase';
import { verifyAdminToken } from '../../../../../lib/auth';

export async function PUT(request, { params }) {
  try {
    await verifyAdminToken(request);
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from('notices')
      .update(body)
      .eq('id', params.id)
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await verifyAdminToken(request);
    const { error } = await supabaseAdmin
      .from('notices')
      .delete()
      .eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
