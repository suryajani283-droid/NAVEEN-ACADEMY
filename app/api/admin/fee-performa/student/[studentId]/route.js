import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/* PATCH — student के details update करें (father, mother, sr_no, dob आदि) */
export async function PATCH(req, { params }) {
  const { studentId } = await params;
  try {
    const body = await req.json();
    const {
      father_name,
      mother_name,
      sr_no,
      dob,
      class_section,
      mobile,
      name,
      route,
    } = body;

    const update = {};
    if (father_name !== undefined) update.father_name = father_name || '';
    if (mother_name !== undefined) update.mother_name = mother_name || '';
    if (sr_no !== undefined) update.sr_no = sr_no || '';
    if (dob !== undefined) update.dob = dob || '';
    if (class_section !== undefined) update.class_section = class_section || '';
    if (mobile !== undefined) update.mobile = mobile || '';
    if (name !== undefined) update.name = name || '';
    if (route !== undefined) update.route = route || '';

    if (!Object.keys(update).length) {
      return NextResponse.json({ error: 'कुछ भी update नहीं' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('fee_performa_students')
      .update(update)
      .eq('id', studentId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, student: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}