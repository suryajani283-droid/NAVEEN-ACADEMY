import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req, { params }) {
  const { examId } = await params;
  try {
    const body = await req.json();
    const {
      student_id,
      father_name, mother_name, mobile, dob, gender,
      photo_url, class_section, sr_no, selected_subjects,
    } = body;

    if (!student_id) {
      return NextResponse.json({ error: 'student_id required' }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('exam_students')
      .select('id, exam_id')
      .eq('id', student_id)
      .single();

    if (!existing || existing.exam_id !== examId) {
      return NextResponse.json({ error: 'गलत request' }, { status: 403 });
    }

    const { error } = await supabaseAdmin
      .from('exam_students')
      .update({
        father_name: father_name || '',
        mother_name: mother_name || '',
        mobile: mobile || '',
        dob: dob || '',
        gender: gender || '',
        photo_url: photo_url || '',
        class_section: class_section || '',
        sr_no: sr_no || '',
        selected_subjects: Array.isArray(selected_subjects) ? selected_subjects : [],
        submitted_at: new Date().toISOString(),
      })
      .eq('id', student_id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}