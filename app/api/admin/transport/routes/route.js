export async function POST(req) {
  const body = await req.json()
  const { name_en, name_hi, color, route_points } = body
  const { data, error } = await supabase
    .from('bus_routes')
    .insert([{ name_en, name_hi, color, route_points: route_points || [] }])
    .select()
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify(data[0]), { status: 201 })
}