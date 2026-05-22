import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase';
import { verifyTeacherSession } from '../../../../../lib/teacherAuth';

export async function PUT(request, { params }) {
  try {
    const { class: teacherClass } = await verifyTeacherSession(request);
    const body = await request.json();

    // Ensure ownership
    const { data: existing } = await supabaseAdmin
      .from('notes')
      .select('class')
      .eq('id', params.id)
      .single();
    if (!existing || existing.class !== teacherClass) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from('notes')
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
    const { class: teacherClass } = await verifyTeacherSession(request);
    const { data: existing } = await supabaseAdmin
      .from('notes')
      .select('class')
      .eq('id', params.id)
      .single();
    if (!existing || existing.class !== teacherClass) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { error } = await supabaseAdmin
      .from('notes')
      .delete()
      .eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}