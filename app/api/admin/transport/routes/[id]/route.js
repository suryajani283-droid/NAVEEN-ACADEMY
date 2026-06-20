import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function PUT(req, { params }) {
  const { id } = params
  const body = await req.json()
  const { name_en, name_hi, color, route_points } = body
  const updateData = { name_en, name_hi, color }
  if (route_points !== undefined) updateData.route_points = route_points
  const { data, error } = await supabase
    .from('bus_routes')
    .update(updateData)
    .eq('id', id)
    .select()
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify(data[0]), { status: 200 })
}

export async function DELETE(req, { params }) {
  const { id } = params
  const { error } = await supabase
    .from('bus_routes')
    .delete()
    .eq('id', id)
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify({ success: true }), { status: 200 })
}