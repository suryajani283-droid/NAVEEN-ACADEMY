import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function PUT(req, { params }) {
  const { id } = params
  const body = await req.json()
  const { name_en, name_hi, lat, lng, stop_order, route_id } = body
  const { data, error } = await supabase
    .from('bus_stops')
    .update({ name_en, name_hi, lat, lng, stop_order, route_id })
    .eq('id', id)
    .select()
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify(data[0]), { status: 200 })
}

export async function DELETE(req, { params }) {
  const { id } = params
  const { error } = await supabase
    .from('bus_stops')
    .delete()
    .eq('id', id)
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify({ success: true }), { status: 200 })
}