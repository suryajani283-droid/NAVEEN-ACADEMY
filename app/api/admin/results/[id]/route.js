import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase';
import { verifyAdminToken } from '../../../../../lib/auth';

export async function PUT(request, { params }) {
  try {
    await verifyAdminToken(request);
    const body = await request.json();

    // Recalculate total, percentage, grade on the server side as well (optional safety)
    const subjectsObj = body.subjects || {};
    const marksArray = Object.values(subjectsObj);
    const total = marksArray.reduce((sum, m) => sum + Number(m), 0);
    const percentage = marksArray.length ? Math.round((total / (marksArray.length * 100)) * 100) / 100 : 0;
    const grade = (pct) => {
      if (pct >= 90) return 'A+';
      if (pct >= 80) return 'A';
      if (pct >= 70) return 'B';
      if (pct >= 60) return 'C';
      if (pct >= 50) return 'D';
      return 'F';
    };

    const { data, error } = await supabaseAdmin
      .from('results')
      .update({
        student_name: body.student_name,
        father_name: body.father_name,
        class: body.class,
        roll_number: body.roll_number,
        dob: body.dob,
        exam_type: body.exam_type,
        subjects: subjectsObj,
        total,
        percentage,
        grade: grade(percentage),
        email: body.email || null,
      })
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
      .from('results')
      .delete()
      .eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
