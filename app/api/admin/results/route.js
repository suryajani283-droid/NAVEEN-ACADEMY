import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { verifyAdminToken } from '../../../../lib/auth';

export async function GET(request) {
  try {
    await verifyAdminToken(request);
    const { data, error } = await supabaseAdmin
      .from('results')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await verifyAdminToken(request);
    const body = await request.json();

    // 1. रिजल्ट इन्सर्ट करें
    const { data: result, error } = await supabaseAdmin
      .from('results')
      .insert({
        student_name: body.student_name,
        father_name: body.father_name,
        class: body.class,
        roll_number: body.roll_number,
        exam_type: body.exam_type,
        subjects: body.subjects,
        total: body.total,
        percentage: body.percentage,
        grade: body.grade,
      })
      .single();

    if (error) throw error;

    // 2. अपने आप PIN और serial जनरेट करें
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const serial = 'SN-' + Date.now();

    await supabaseAdmin.from('pins').insert({
      code: pin,
      serial_number: serial,
      result_id: result.id,
    });

    return NextResponse.json({ result, pin, serial }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
