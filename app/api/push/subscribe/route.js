import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function POST(request) {
  try {
    const { subscription, class: studentClass } = await request.json();
    if (!subscription) return NextResponse.json({ error: 'Subscription required' }, { status: 400 });

    // Insert (ignore duplicates by same endpoint)
    const { error } = await supabaseAdmin
      .from('push_subscriptions')
      .insert({ subscription, class: studentClass || null });

    if (error && error.code !== '23505') throw error; // 23505 = duplicate
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}