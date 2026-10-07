import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req, { params }) {
  const { id } = await params;
  try {
    const { performa_id } = await req.json();
    if (!performa_id) return NextResponse.json({ error: 'performa_id required' }, { status: 400 });

    const { data: sheet } = await supabaseAdmin
      .from('fee_performa').select('*').eq('id', performa_id).single();

    const { data: students, error } = await supabaseAdmin
      .from('fee_performa_students').select('*').eq('performa_id', performa_id).order('sno');
    if (error) throw error;

    if (!students?.length) {
      return NextResponse.json({ error: 'इस कक्षा में कोई छात्र नहीं मिला' }, { status: 400 });
    }

    await supabaseAdmin.from('exam_students').delete().eq('exam_id', id);

    const payload = students.map((s, i) => ({
      exam_id: id,
      student_name: s.name || '',
      father_name: '',
      mother_name: '',
      mobile: s.mobile || '',
      roll_no: String(i + 1),
      enrollment_no: '',
      class_section: sheet?.class_name || '',
      dob: '',
      gender: '',
      photo_url: '',
      sort_order: i,
    }));

    const { error: e2 } = await supabaseAdmin.from('exam_students').insert(payload);
    if (e2) throw e2;

    return NextResponse.json({ imported: payload.length, class_name: sheet?.class_name });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}