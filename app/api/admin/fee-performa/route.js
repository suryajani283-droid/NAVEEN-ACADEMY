import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { normalizeStudent } from '@/lib/feePerforma';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('fee_performa')
    .select('id, class_name, session, updated_at')
    .order('class_name', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  try {
    const { class_name, session = '2025-26', students = [] } = await req.json();
    if (!class_name) {
      return NextResponse.json({ error: 'class_name is required' }, { status: 400 });
    }

    const { data: sheet, error: e1 } = await supabaseAdmin
      .from('fee_performa')
      .insert({ class_name, session })
      .select()
      .single();
    if (e1) throw e1;

    if (students.length) {
      const payload = students.map((s, i) => ({
        ...normalizeStudent(s, i),
        performa_id: sheet.id,
      }));
      const { error: e2 } = await supabaseAdmin
        .from('fee_performa_students')
        .insert(payload);
      if (e2) throw e2;
    }

    return NextResponse.json(sheet, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}