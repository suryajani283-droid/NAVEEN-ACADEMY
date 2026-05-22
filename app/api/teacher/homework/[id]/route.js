import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase';
import { verifyTeacherSession } from '../../../../../lib/teacherAuth';

export async function PUT(request, { params }) {
  try {
    const { class: teacherClass } = await verifyTeacherSession(request);
    const body = await request.json();

    // Ensure the homework belongs to the teacher's class
    const { data: existing } = await supabaseAdmin
      .from('homework')
      .select('class')
      .eq('id', params.id)
      .single();

    if (!existing || existing.class !== teacherClass) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
    const { class: teacherClass } = await verifyTeacherSession(request);

    // Ensure ownership
    const { data: existing } = await supabaseAdmin
      .from('homework')
      .select('class')
      .eq('id', params.id)
      .single();

    if (!existing || existing.class !== teacherClass) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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