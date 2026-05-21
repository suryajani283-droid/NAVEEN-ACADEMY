'use client'
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const allClasses = ['Nursery', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => String(i + 1))]

export default function AdminAdmissions() {
  const [admissions, setAdmissions] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [error, setError] = useState('')

  const fetchAdmissions = async () => {
    setError('')
    let query = supabase.from('admissions').select('*').order('created_at', { ascending: false })
    if (selectedClass) {
      query = query.eq('class_applying', selectedClass)
    }
    const { data, error: fetchError } = await query
    if (fetchError) {
      setError(fetchError.message)
    } else {
      setAdmissions(data || [])
    }
  }

  useEffect(() => {
    fetchAdmissions()
  }, [selectedClass])

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return
    const res = await fetch('/api/admin/admissions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
      credentials: 'include',
    })
    if (res.ok) {
      fetchAdmissions()
    } else {
      alert('Failed to delete')
    }
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Admission Applications</h2>

      <div className="card mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Class</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Classes</option>
          {allClasses.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="card bg-red-50 border border-red-200 mb-8 text-red-600 text-sm">
          Error: {error}
        </div>
      )}

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
            {admissions.length === 0 && !error && (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  No applications yet.
                </td>
              </tr>
            )}
            {admissions.map((app) => (
              <tr key={app.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{app.student_name}</td>
                <td className="p-3">{app.father_name}</td>
                <td className="p-3">{app.class_applying}</td>
                <td className="p-3">{app.phone}</td>
                <td className="p-3">{app.email}</td>
                <td className="p-3">{new Date(app.created_at).toLocaleDateString('en-IN')}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(app.id)} className="text-red-600 text-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}