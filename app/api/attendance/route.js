import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const classFilter = searchParams.get('class')

  let query = supabase
    .from('attendance')
    .select('*, students!inner(student_name, father_name, class, parent_phone)')

  if (classFilter) {
    query = query.eq('students.class', classFilter)
  }

  if (from && to) {
    query = query.gte('date', from).lte('date', to)
  } else if (date) {
    query = query.eq('date', date)
  }

  query = query.order('date', { ascending: true }).order('student_id')

  const { data, error } = await query
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify(data), { status: 200 })
}

export async function POST(req) {
  const { records } = await req.json()
  const { data, error } = await supabase
    .from('attendance')
    .upsert(records, { onConflict: 'student_id, date' })
    .select()
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify(data), { status: 200 })
}