import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { verifyTeacherSession } from '../../../../lib/teacherAuth';

export async function GET(request) {
  try {
    const { class: teacherClass } = await verifyTeacherSession(request);

    const { data, error } = await supabaseAdmin
      .from('homework')
      .select('*')
      .eq('class', teacherClass)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { class: teacherClass } = await verifyTeacherSession(request);
    const body = await request.json();

    // Force the class to be the teacher's class
    const payload = { ...body, class: teacherClass };

    const { data, error } = await supabaseAdmin
      .from('homework')
      .insert(payload)
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}