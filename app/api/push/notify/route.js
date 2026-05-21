import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { verifyAdminToken } from '../../../../lib/auth';
import webpush from 'web-push';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function POST(request) {
  try {
    await verifyAdminToken(request);
    const { title, body, url, targetClass } = await request.json();

    // Fetch subscriptions (optionally filter by class)
    let query = supabaseAdmin.from('push_subscriptions').select('subscription');
    if (targetClass) {
      query = query.or(`class.eq.${targetClass},class.is.null`);
    }
    const { data: subscriptions, error } = await query;
    if (error) throw error;

    const payload = JSON.stringify({
      title: title || 'Naveen Academy',
      body: body || 'New update available',
      icon: '/images/logo.png',
      badge: '/images/logo.png',
      data: { url: url || '/student-corner' },
    });

    // Send to all subscriptions (best effort)
    const results = await Promise.allSettled(
      subscriptions.map(async (row) => {
        try {
          await webpush.sendNotification(row.subscription, payload);
        } catch (err) {
          // Remove invalid subscriptions
          if (err.statusCode === 410 || err.statusCode === 404) {
            await supabaseAdmin.from('push_subscriptions').delete().eq('subscription', row.subscription);
          }
        }
      })
    );

    return NextResponse.json({ sent: subscriptions.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}