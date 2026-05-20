import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function POST(request) {
  try {
    const { class: cls, roll, dob } = await request.json();

    // Find result matching class, roll number and date of birth
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

    return NextResponse.json({ result });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
