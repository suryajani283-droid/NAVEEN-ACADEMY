import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  try {
    const subscription = await req.json()

    // Basic validation
    if (!subscription || !subscription.endpoint) {
      return new Response(JSON.stringify({ error: 'Invalid subscription' }), { status: 400 })
    }

    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          endpoint: subscription.endpoint,
          subscription: subscription,   // store the whole object as JSONB
          created_at: new Date()
        },
        { onConflict: 'endpoint' }
      )

    if (error) {
      console.error('Subscription save error:', error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error('Subscribe API error:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}

export async function DELETE(req) {
  const { endpoint } = await req.json()
  if (!endpoint) {
    return new Response(JSON.stringify({ error: 'Missing endpoint' }), { status: 400 })
  }
  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('endpoint', endpoint)
  if (error) {
    console.error('Delete error:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 })
}