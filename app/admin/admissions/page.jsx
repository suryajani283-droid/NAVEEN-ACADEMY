import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '../../../lib/supabase'

const allClasses = ['Nursery', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => String(i + 1))]

export default async function AdminAdmissions({ searchParams }) {
  const cookieStore = cookies()
  const token = cookieStore.get('adminToken')
  if (!token) redirect('/admin')

  const selectedClass = searchParams?.class || ''

  let query = supabaseAdmin.from('admissions').select('*').order('created_at', { ascending: false })
  if (selectedClass) {
    query = query.eq('class_applying', selectedClass)
  }
  const { data: admissions } = await query

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Admission Applications</h2>

      <form className="card mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Class</label>
        <select
          name="class"
          defaultValue={selectedClass}
          onChange={(e) => {
            const url = new URL(window.location)
            url.searchParams.set('class', e.target.value)
            window.location = url.toString()
          }}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Classes</option>
          {allClasses.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </form>

      {admissions && admissions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-primary-500 text-white">
                <th className="p-3">Name</th>
                <th className="p-3">Father</th>
                <th className="p-3">Class</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {admissions.map((app) => (
                <tr key={app.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{app.student_name}</td>
                  <td className="p-3">{app.father_name}</td>
                  <td className="p-3">{app.class_applying}</td>
                  <td className="p-3">{app.phone}</td>
                  <td className="p-3">{app.email}</td>
                  <td className="p-3">{new Date(app.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="p-3">
                    <form action="/api/admin/admissions/delete" method="POST">
                      <input type="hidden" name="id" value={app.id} />
                      <button type="submit" className="text-red-600 text-sm">Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-12">No admission applications yet.</p>
      )}
    </div>
  )
}
