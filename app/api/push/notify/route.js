import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  // VAPID details sirf tabhi set karein jab request aaye
  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )

  const { title, body, url } = await req.json()
  const payload = JSON.stringify({ title, body, url })

  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('subscription')

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  const results = []
  for (const sub of subs) {
    try {
      // Parse the subscription if it's a string (fixes double-encoding issue)
      const pushSubscription = typeof sub.subscription === 'string'
        ? JSON.parse(sub.subscription)
        : sub.subscription

      await webpush.sendNotification(pushSubscription, payload)
      results.push({ endpoint: pushSubscription.endpoint, status: 'sent' })
    } catch (err) {
      // Extract endpoint from parsed subscription for deletion
      let endpoint = null
      try {
        const parsed = typeof sub.subscription === 'string' ? JSON.parse(sub.subscription) : sub.subscription
        endpoint = parsed?.endpoint
      } catch (e) {
        endpoint = null
      }

      if ((err.statusCode === 410 || err.statusCode === 404) && endpoint) {
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('endpoint', endpoint)
      }
      results.push({ endpoint: endpoint || 'unknown', status: 'failed', error: err.message })
    }
  }

  return new Response(JSON.stringify({ results }), { status: 200 })
}