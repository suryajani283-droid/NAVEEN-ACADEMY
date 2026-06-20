import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

export async function POST(req) {
  const { title, body, url } = await req.json()
  const payload = JSON.stringify({ title, body, url })

  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('subscription')

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  const results = []
  for (const sub of subs) {
    try {
      await webpush.sendNotification(sub.subscription, payload)
      results.push({ endpoint: sub.subscription.endpoint, status: 'sent' })
    } catch (err) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        await supabase.from('push_subscriptions').delete().eq('endpoint', sub.subscription.endpoint)
      }
      results.push({ endpoint: sub.subscription.endpoint, status: 'failed' })
    }
  }

  return new Response(JSON.stringify({ results }), { status: 200 })
}