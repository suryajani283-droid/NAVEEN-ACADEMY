import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/* ============ GET — Load exam + subjects + students ============ */
export async function GET(_req, { params }) {
  const { id } = await params;

  const { data: exam, error: e1 } = await supabaseAdmin
    .from('exams')
    .select('*')
    .eq('id', id)
    .single();

  if (e1) return NextResponse.json({ error: e1.message }, { status: 404 });

  const { data: subjects } = await supabaseAdmin
    .from('exam_subjects')
    .select('*')
    .eq('exam_id', id)
    .order('sort_order');

  const { data: students } = await supabaseAdmin
    .from('exam_students')
    .select('*')
    .eq('exam_id', id)
    .order('sort_order');

  return NextResponse.json({
    ...exam,
    subjects: subjects || [],
    students: students || [],
  });
}

/* ============ PUT — Save exam + subjects + students ============ */
export async function PUT(req, { params }) {
  const { id } = await params;
  try {
    const body = await req.json();

    const {
      name,
      class_name,
      session,
      exam_type,
      instructions,
      public_form_open,
      form_deadline,
      subjects = [],
      students = [],
    } = body;

    /* 1. Exams table update — सभी fields जिनकी जरूरत है */
    const { error: e1 } = await supabaseAdmin
      .from('exams')
      .update({
        name,
        class_name,
        session,
        exam_type,
        instructions,
        public_form_open: public_form_open ?? false,
        form_deadline: form_deadline || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    if (e1) throw e1;

    /* 2. Subjects refresh */
    await supabaseAdmin.from('exam_subjects').delete().eq('exam_id', id);
    if (subjects.length) {
      await supabaseAdmin.from('exam_subjects').insert(
        subjects.map((s, i) => ({
          exam_id: id,
          subject: s.subject || '',
          exam_date: s.exam_date || null,
          start_time: s.start_time || '',
          end_time: s.end_time || '',
          sort_order: i,
        }))
      );
    }

    /* 3. Students refresh — सभी नए fields सहित */
    await supabaseAdmin.from('exam_students').delete().eq('exam_id', id);
    if (students.length) {
      await supabaseAdmin.from('exam_students').insert(
        students.map((s, i) => ({
          exam_id: id,
          student_name: s.student_name || '',
          father_name: s.father_name || '',
          mother_name: s.mother_name || '',
          mobile: s.mobile || '',
          roll_no: s.roll_no || '',
          enrollment_no: s.enrollment_no || '',
          class_section: s.class_section || '',
          dob: s.dob || '',
          gender: s.gender || '',
          photo_url: s.photo_url || '',
          sr_no: s.sr_no || '',
          selected_subjects: Array.isArray(s.selected_subjects) ? s.selected_subjects : [],
          sort_order: i,
        }))
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ============ DELETE — पूरा exam हटाएँ ============ */
export async function DELETE(_req, { params }) {
  const { id } = await params;
  const { error } = await supabaseAdmin.from('exams').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}