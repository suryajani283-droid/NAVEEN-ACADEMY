import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(_req, { params }) {
  const { examId } = await params;

  const { data: exam, error } = await supabaseAdmin
    .from('exams')
    .select('id, name, class_name, session, exam_type, public_form_open, form_deadline, instructions')
    .eq('id', examId)
    .single();

  if (error || !exam) {
    return NextResponse.json({ error: 'परीक्षा नहीं मिली' }, { status: 404 });
  }
  if (!exam.public_form_open) {
    return NextResponse.json({ error: 'फॉर्म अभी बंद है' }, { status: 403 });
  }
  if (exam.form_deadline && new Date(exam.form_deadline) < new Date()) {
    return NextResponse.json({ error: 'फॉर्म की अंतिम तिथि बीत चुकी है' }, { status: 403 });
  }

  // subjects list (student इनमें से चुनेगा)
  const { data: subjects } = await supabaseAdmin
    .from('exam_subjects')
    .select('subject')
    .eq('exam_id', examId)
    .order('sort_order');

  // class list — exam.class_name में comma हो सकते हैं
  const classes = String(exam.class_name || '')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);

  return NextResponse.json({
    ...exam,
    classes: classes.length ? classes : [exam.class_name || ''],
    subject_options: (subjects || []).map((s) => s.subject).filter(Boolean),
  });
}