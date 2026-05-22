import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase';
import { verifyAdminToken } from '../../../../../lib/auth';

export async function PUT(request, { params }) {
  try {
    const payload = await verifyAdminToken(request);
    const body = await request.json();

    // If teacher, ensure they own this homework (same class)
    if (payload.role === 'teacher' && payload.class) {
      const { data: existing } = await supabaseAdmin
        .from('homework')
        .select('class')
        .eq('id', params.id)
        .single();
      if (!existing || String(existing.class) !== String(payload.class)) {
        return NextResponse.json({ error: 'You can only edit homework for your own class' }, { status: 403 });
      }
    }

    const { data, error } = await supabaseAdmin
      .from('homework')
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
    const payload = await verifyAdminToken(request);

    // If teacher, ensure they own this homework
    if (payload.role === 'teacher' && payload.class) {
      const { data: existing } = await supabaseAdmin
        .from('homework')
        .select('class')
        .eq('id', params.id)
        .single();
      if (!existing || String(existing.class) !== String(payload.class)) {
        return NextResponse.json({ error: 'You can only delete homework for your own class' }, { status: 403 });
      }
    }

    const { error } = await supabaseAdmin
      .from('homework')
      .delete()
      .eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}