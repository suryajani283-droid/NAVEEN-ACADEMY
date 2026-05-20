import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function POST(request) {
  try {
    const { class: cls, roll, dob } = await request.json();

    // Find the exact result
    const { data: result, error } = await supabaseAdmin
      .from('results')
      .select('*')
      .eq('class', Number(cls))
      .eq('roll_number', roll)
      .eq('dob', dob)
      .single();

    if (error || !result) {
      return NextResponse.json({ error: 'No result found. Check your details.' }, { status: 404 });
    }

    // Calculate rank: count of students with higher percentage in the same class & exam type
    const { count, error: rankError } = await supabaseAdmin
      .from('results')
      .select('*', { count: 'exact', head: true })
      .eq('class', result.class)
      .eq('exam_type', result.exam_type)
      .gt('percentage', result.percentage);

    if (rankError) {
      // if rank query fails, still return result without rank
      return NextResponse.json({ result });
    }

    const rank = count + 1;

    return NextResponse.json({ result, rank });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
