import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase';
import { verifyAdminToken } from '../../../../../lib/auth';

export async function PUT(request, { params }) {
  try {
    await verifyAdminToken(request);
    const body = await request.json();

    // Recalculate from the subjects object if needed (as a safety)
    const subjects = body.subjects || {};
    let totalObtained = 0, totalMax = 0;
    Object.values(subjects).forEach(val => {
      if (typeof val === 'object' && val.obtained !== undefined) {
        totalObtained += val.obtained;
        totalMax += val.max;
      } else {
        totalObtained += val; // old plain number
        totalMax += 100;
      }
    });
    const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 10000) / 100 : 0;
    const grade = (pct) => {
      if (pct >= 90) return 'A+'; if (pct >= 80) return 'A'; if (pct >= 70) return 'B';
      if (pct >= 60) return 'C'; if (pct >= 50) return 'D'; return 'F';
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
        subjects: subjects,
        total: totalObtained,
        total_max: totalMax,
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
