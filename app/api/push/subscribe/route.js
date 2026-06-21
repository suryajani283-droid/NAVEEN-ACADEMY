import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  const subscription = await req.json()
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({
      endpoint: subscription.endpoint,
      subscription: subscription,
      created_at: new Date()
    }, { onConflict: 'endpoint' })

  if (error) {
    console.error('Insert error:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 })
}