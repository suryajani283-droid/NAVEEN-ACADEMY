import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const studentId = searchParams.get('student_id')
  const fromDate = searchParams.get('from') || '2025-04-01' // start of academic year

  let query = supabase
    .from('attendance')
    .select('id', { count: 'exact' })
    .eq('student_id', studentId)
    .eq('status', 'absent')
    .gte('date', fromDate)

  const { count, error } = await query
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify({ count }), { status: 200 })
}