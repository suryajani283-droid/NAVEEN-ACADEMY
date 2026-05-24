import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function POST(request) {
  try {
    const { class: cls, roll, dob, exam_type } = await request.json();

    // Find result matching all criteria
    let query = supabaseAdmin
      .from('results')
      .select('*')
      .eq('class', Number(cls))
      .eq('roll_number', roll)
      .eq('dob', dob);

    if (exam_type) {
      query = query.eq('exam_type', exam_type);
    }

    const { data: result, error } = await query.single();

    if (error || !result) {
      return NextResponse.json({ error: 'No result found. Check your details.' }, { status: 404 });
    }

    // Calculate rank
    const { count } = await supabaseAdmin
      .from('results')
      .select('*', { count: 'exact', head: true })
      .eq('class', result.class)
      .eq('exam_type', result.exam_type)
      .gt('percentage', result.percentage);

    const rank = count !== null ? count + 1 : null;

    return NextResponse.json({ result, rank });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}