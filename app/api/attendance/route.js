import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Save attendance records (array of { student_id, date, status })
export async function POST(req) {
  const { records } = await req.json()
  // Use upsert to handle if already marked today
  const { data, error } = await supabase
    .from('attendance')
    .upsert(records, { onConflict: 'student_id, date' })
    .select()
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify(data), { status: 200 })
}

// Get attendance for a specific class and date
export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
  const classFilter = searchParams.get('class')

  let query = supabase
    .from('attendance')
    .select('*, students!inner(class, student_name, father_name, parent_phone)')

  if (classFilter) query = query.eq('students.class', classFilter)
  query = query.eq('date', date)

  const { data, error } = await query
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify(data), { status: 200 })
}