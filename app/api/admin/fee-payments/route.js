import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('student_id');
    if (!studentId) {
      return NextResponse.json({ error: 'student_id required' }, { status: 400 });
    }
    const { data, error } = await supabaseAdmin
      .from('fee_payments')
      .select('*')
      .eq('student_id', studentId)
      .order('payment_date', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { student_id, performa_id, amount, payment_date, note = '' } = body;

    if (!student_id || !performa_id) {
      return NextResponse.json(
        { error: 'student_id और performa_id ज़रूरी हैं' },
        { status: 400 }
      );
    }
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      return NextResponse.json({ error: 'राशि सही भरें' }, { status: 400 });
    }
    if (!payment_date) {
      return NextResponse.json({ error: 'दिनांक ज़रूरी है' }, { status: 400 });
    }

    /* पहली बार add करते समय पुरानी paid value को opening balance के रूप में save करें */
    const { count } = await supabaseAdmin
      .from('fee_payments')
      .select('id', { count: 'exact', head: true })
      .eq('student_id', student_id);

    if ((count || 0) === 0) {
      const { data: student } = await supabaseAdmin
        .from('fee_performa_students')
        .select('paid')
        .eq('id', student_id)
        .single();

      const existingPaid = Number(student?.paid || 0);
      if (existingPaid > 0) {
        await supabaseAdmin.from('fee_payments').insert({
          student_id,
          performa_id,
          amount: existingPaid,
          payment_date: new Date().toISOString().slice(0, 10),
          note: 'पिछली जमा राशि',
        });
      }
    }

    const { error: e1 } = await supabaseAdmin.from('fee_payments').insert({
      student_id,
      performa_id,
      amount: amt,
      payment_date,
      note,
    });
    if (e1) throw e1;

    const { data: allPayments } = await supabaseAdmin
      .from('fee_payments')
      .select('amount')
      .eq('student_id', student_id);

    const totalPaid = (allPayments || []).reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    await supabaseAdmin
      .from('fee_performa_students')
      .update({ paid: totalPaid })
      .eq('id', student_id);

    return NextResponse.json({ ok: true, paid: totalPaid });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}