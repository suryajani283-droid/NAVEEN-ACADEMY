import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET() {
  const { data, error } = await supabase
    .from('bus_routes')
    .select('*')
    .order('id')
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify(data), { status: 200 })
}

export async function POST(req) {
  const body = await req.json()
  const { name_en, name_hi, color } = body
  const { data, error } = await supabase
    .from('bus_routes')
    .insert([{ name_en, name_hi, color }])
    .select()
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify(data[0]), { status: 201 })
}