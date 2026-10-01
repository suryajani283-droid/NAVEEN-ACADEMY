import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { normalizeStudent } from '@/lib/feePerforma';

export async function GET(_req, { params }) {
  const { id } = await params;

  const { data: sheet, error: e1 } = await supabaseAdmin
    .from('fee_performa')
    .select('*')
    .eq('id', id)
    .single();
  if (e1) return NextResponse.json({ error: e1.message }, { status: 404 });

  const { data: students, error: e2 } = await supabaseAdmin
    .from('fee_performa_students')
    .select('*')
    .eq('performa_id', id)
    .order('sno', { ascending: true });
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

  return NextResponse.json({ ...sheet, students });
}

export async function PUT(req, { params }) {
  const { id } = await params;
  try {
    const { class_name, session, students = [] } = await req.json();

    const { error: e1 } = await supabaseAdmin
      .from('fee_performa')
      .update({ class_name, session, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (e1) throw e1;

    const { error: eDel } = await supabaseAdmin
      .from('fee_performa_students')
      .delete()
      .eq('performa_id', id);
    if (eDel) throw eDel;

    if (students.length) {
      const payload = students.map((s, i) => ({
        ...normalizeStudent(s, i),
        performa_id: id,
      }));
      const { error: e2 } = await supabaseAdmin
        .from('fee_performa_students')
        .insert(payload);
      if (e2) throw e2;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  const { id } = await params;
  const { error } = await supabaseAdmin.from('fee_performa').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}