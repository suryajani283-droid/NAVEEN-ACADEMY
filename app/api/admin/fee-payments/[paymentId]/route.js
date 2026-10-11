import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function DELETE(_req, { params }) {
  const { paymentId } = await params;
  try {
    const { data: payment } = await supabaseAdmin
      .from('fee_payments')
      .select('student_id')
      .eq('id', paymentId)
      .single();

    if (!payment) {
      return NextResponse.json({ error: 'Payment नहीं मिली' }, { status: 404 });
    }

    const studentId = payment.student_id;

    await supabaseAdmin.from('fee_payments').delete().eq('id', paymentId);

    const { data: allPayments } = await supabaseAdmin
      .from('fee_payments')
      .select('amount')
      .eq('student_id', studentId);

    const totalPaid = (allPayments || []).reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    await supabaseAdmin
      .from('fee_performa_students')
      .update({ paid: totalPaid })
      .eq('id', studentId);

    return NextResponse.json({ ok: true, paid: totalPaid });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}