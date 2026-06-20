import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const stopId = searchParams.get('stop_id')
  let query = supabase.from('bus_students').select('*, bus_stops(name_en, name_hi, route_id)')
  if (stopId) query = query.eq('stop_id', stopId)
  const { data, error } = await query.order('student_name')
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify(data), { status: 200 })
}

export async function POST(req) {
  const body = await req.json()
  const { stop_id, student_name, father_name, class: className, mobile, address } = body
  const { data, error } = await supabase
    .from('bus_students')
    .insert([{ stop_id, student_name, father_name, class: className, mobile, address }])
    .select()
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify(data[0]), { status: 201 })
}