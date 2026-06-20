import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function PUT(req, { params }) {
  const { id } = params
  const body = await req.json()
  const { student_name, father_name, class: className, mobile, address } = body
  const { data, error } = await supabase
    .from('bus_students')
    .update({ student_name, father_name, class: className, mobile, address })
    .eq('id', id)
    .select()
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify(data[0]), { status: 200 })
}

export async function DELETE(req, { params }) {
  const { id } = params
  const { error } = await supabase
    .from('bus_students')
    .delete()
    .eq('id', id)
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify({ success: true }), { status: 200 })
}