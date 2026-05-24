import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { verifyAdminToken } from '../../../../lib/auth';

export async function POST(request) {
  try {
    await verifyAdminToken(request);
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from('video_lectures')
      .insert({
        subject: body.subject,
        chapter: body.chapter,
        title: body.title,
        youtube_url: body.youtube_url,
        class: body.class ? Number(body.class) : null,
      })
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}