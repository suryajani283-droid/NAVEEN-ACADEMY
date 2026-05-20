import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { verifyAdminToken } from '../../../../lib/auth';

export async function GET(request) {
  try {
    await verifyAdminToken(request);
    const { data, error } = await supabaseAdmin
      .from('timetables')
      .select('*')
      .order('class');
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

    // Upsert: if a timetable for this class already exists, update it; otherwise insert
    const { data, error } = await supabaseAdmin
      .from('timetables')
      .upsert(
        { class: body.class, file_url: body.file_url },
        { onConflict: 'class' }
      )
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
