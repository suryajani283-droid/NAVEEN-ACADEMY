import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const routeId = searchParams.get('route_id')
  let query = supabase.from('bus_stops').select('*').order('stop_order')
  if (routeId) query = query.eq('route_id', routeId)
  const { data, error } = await query
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify(data), { status: 200 })
}

export async function POST(req) {
  const body = await req.json()
  const { route_id, name_en, name_hi, lat, lng, stop_order } = body
  const { data, error } = await supabase
    .from('bus_stops')
    .insert([{ route_id, name_en, name_hi, lat, lng, stop_order }])
    .select()
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify(data[0]), { status: 201 })
}