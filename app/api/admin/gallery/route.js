import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { verifyAdminToken } from '../../../../lib/auth';

export async function GET(request) {
  try {
    await verifyAdminToken(request);
    const { data, error } = await supabaseAdmin
      .from('gallery_items')
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

    const { data, error } = await supabaseAdmin
      .from('gallery_items')
      .insert({
        title: body.title,
        category: body.category,
        image_url: body.image_url,
      })
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
