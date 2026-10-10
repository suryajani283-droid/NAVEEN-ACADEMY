import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { normalizeStudent } from '@/lib/feePerforma';

/* ============ GET — Load sheet + students ============ */
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

/* ============ PUT — ID-preserving update ============
   पुराने students के IDs बनाए रखता है ताकि fee_payments history
   कभी न टूटे। सिर्फ नए students insert होंगे और हटाए गए delete।
==================================================== */
export async function PUT(req, { params }) {
  const { id } = await params;
  try {
    const { class_name, session, students = [] } = await req.json();

    /* 1. Sheet metadata update */
    const { error: e1 } = await supabaseAdmin
      .from('fee_performa')
      .update({ class_name, session, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (e1) throw e1;

    /* 2. Existing IDs fetch */
    const { data: existing } = await supabaseAdmin
      .from('fee_performa_students')
      .select('id')
      .eq('performa_id', id);
    const existingIds = new Set((existing || []).map((s) => s.id));

    /* 3. Split: update vs insert */
    const toUpdate = [];
    const toInsert = [];

    students.forEach((s, i) => {
      const payload = { ...normalizeStudent(s, i), performa_id: id };
      if (s.id && existingIds.has(s.id)) {
        toUpdate.push({ ...payload, id: s.id });
        existingIds.delete(s.id);
      } else {
        toInsert.push(payload);
      }
    });

    /* 4. Delete students जो frontend से हटा दिए */
    const toDeleteIds = [...existingIds];
    if (toDeleteIds.length) {
      const { error: eDel } = await supabaseAdmin
        .from('fee_performa_students')
        .delete()
        .in('id', toDeleteIds);
      if (eDel) throw eDel;
    }

    /* 5. Updates */
    for (const s of toUpdate) {
      const { id: sid, ...rest } = s;
      const { error: eUpd } = await supabaseAdmin
        .from('fee_performa_students')
        .update(rest)
        .eq('id', sid);
      if (eUpd) throw eUpd;
    }

    /* 6. New inserts */
    if (toInsert.length) {
      const { error: eIns } = await supabaseAdmin
        .from('fee_performa_students')
        .insert(toInsert);
      if (eIns) throw eIns;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ============ DELETE — पूरा sheet हटाएँ ============ */
export async function DELETE(_req, { params }) {
  const { id } = await params;
  const { error } = await supabaseAdmin
    .from('fee_performa')
    .delete()
    .eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}