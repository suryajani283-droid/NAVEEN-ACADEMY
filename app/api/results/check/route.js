import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function POST(request) {
  try {
    const { class: cls, roll, dob, exam_type } = await request.json();

    // Build query
    let query = supabaseAdmin
      .from('results')
      .select('*')
      .eq('class', Number(cls))
      .eq('roll_number', roll)
      .eq('dob', dob);

    // If exam_type is provided and not "all", filter by it
    if (exam_type && exam_type !== 'all') {
      query = query.eq('exam_type', exam_type);
    }

    const { data: results, error } = await query.order('created_at', { ascending: false });

    if (error || !results || results.length === 0) {
      return NextResponse.json({ error: 'No results found. Check your details.' }, { status: 404 });
    }

    // If a specific exam was requested, return that single result with rank
    if (exam_type && exam_type !== 'all') {
      const result = results[0];
      
      // Calculate rank for this exam
      const { count } = await supabaseAdmin
        .from('results')
        .select('*', { count: 'exact', head: true })
        .eq('class', result.class)
        .eq('exam_type', result.exam_type)
        .gt('percentage', result.percentage);

      const rank = count !== null ? count + 1 : null;
      return NextResponse.json({ result, rank, availableExams: results.map(r => r.exam_type) });
    }

    // If no specific exam, return all available exam types and the first result
    const availableExams = results.map(r => r.exam_type);
    const firstResult = results[0];

    // Calculate rank for the first result
    const { count } = await supabaseAdmin
      .from('results')
      .select('*', { count: 'exact', head: true })
      .eq('class', firstResult.class)
      .eq('exam_type', firstResult.exam_type)
      .gt('percentage', firstResult.percentage);

    const rank = count !== null ? count + 1 : null;

    return NextResponse.json({ 
      result: firstResult, 
      rank, 
      availableExams 
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}