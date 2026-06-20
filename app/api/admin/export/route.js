import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET() {
  try {
    // Fetch all routes
    const { data: routes, error: routeErr } = await supabase
      .from('bus_routes')
      .select('*')
      .order('id')
    if (routeErr) throw new Error(routeErr.message)

    // Fetch all stops with route info
    const { data: stops, error: stopErr } = await supabase
      .from('bus_stops')
      .select('*, bus_routes(name_en, name_hi, color)')
      .order('route_id')
    if (stopErr) throw new Error(stopErr.message)

    // Fetch all students
    const { data: students, error: studentErr } = await supabase
      .from('bus_students')
      .select('*, bus_stops(name_en, name_hi, route_id)')
      .order('stop_id')
    if (studentErr) throw new Error(studentErr.message)

    // Build CSV header
    const headers = [
      'Route Name (EN)', 'Route Name (HI)',
      'Stop Name (EN)', 'Stop Name (HI)',
      'Student Name', 'Father Name', 'Class', 'Mobile', 'Address'
    ]

    // Build rows
    const rows = []

    // Loop through each student, find corresponding stop and route
    for (const student of students) {
      const stop = stops.find(s => s.id === student.stop_id)
      const route = routes.find(r => r.id === stop?.route_id)

      rows.push([
        route?.name_en || '',
        route?.name_hi || '',
        stop?.name_en || '',
        stop?.name_hi || '',
        student.student_name,
        student.father_name,
        student.class,
        student.mobile || '',
        student.address || ''
      ])
    }

    // Convert to CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    // Return as downloadable file
    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename=bus_students.csv'
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}