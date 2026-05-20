import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { verifyAdminToken } from '../../../../lib/auth';

export async function POST(request) {
  try {
    await verifyAdminToken(request);
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from('timetables')
      .upsert(
        {
          class: body.class,
          file_url: body.file_url,
          start_date: body.start_date || null,
          time_details: body.time_details || null,
          description: body.description || null,
        },
        { onConflict: 'class' }
      )
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
