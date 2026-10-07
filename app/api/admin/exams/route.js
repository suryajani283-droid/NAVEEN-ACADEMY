import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('exams')
    .select('id, name, class_name, session, exam_type, updated_at')
    .order('updated_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      class_name,
      session = '2025-26',
      exam_type = 'Half Yearly',
      instructions = '',
    } = body;

    if (!name || !class_name) {
      return NextResponse.json(
        { error: 'name and class_name required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('exams')
      .insert({
        name,
        class_name,
        session,
        exam_type,
        instructions,
        public_form_open: false,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}