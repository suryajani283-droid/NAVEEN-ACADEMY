'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const classes = [1,2,3,4,5,6,7,8,9,10,11,12]

export default function AdminTimetable() {
  const [timetables, setTimetables] = useState([])
  const [form, setForm] = useState({
    class: '',
    file_url: '',
    start_date: '',
    time_details: '',
    description: '',
  })

  const fetchTimetables = async () => {
    const { data } = await supabase
      .from('timetables')
      .select('*')
      .order('class')
    setTimetables(data || [])
  }

  useEffect(() => { fetchTimetables() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/admin/timetable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include',
    })
    if (res.ok) {
      setForm({ class: '', file_url: '', start_date: '', time_details: '', description: '' })
      fetchTimetables()
    } else {
      const errData = await res.json().catch(() => ({ error: 'Unknown error' }))
      alert('Error saving timetable: ' + (errData.error || res.statusText))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this timetable?')) return
    await fetch(`/api/admin/timetable/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchTimetables()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Manage Timetables</h2>

      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <select
            value={form.class}
            onChange={(e) => setForm({ ...form, class: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          >
            <option value="">-- Select Class --</option>
            {classes.map((c) => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="File URL (image or PDF)"
            value={form.file_url}
            onChange={(e) => setForm({ ...form, file_url: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="date"
            placeholder="Start Date"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Time / Schedule (e.g., 8 AM - 2 PM)"
            value={form.time_details}
            onChange={(e) => setForm({ ...form, time_details: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <textarea
          placeholder="Details / Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          rows="3"
        />
        <button type="submit" className="btn-primary">Save Timetable</button>
      </form>

      <div className="space-y-4">
        {timetables.map((t) => (
          <div key={t.id} className="card flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h3 className="font-semibold">Class {t.class}</h3>
              {t.description && <p className="text-gray-600 text-sm">{t.description}</p>}
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                {t.start_date && <span>📅 {new Date(t.start_date).toLocaleDateString('en-IN')}</span>}
                {t.time_details && <span>🕒 {t.time_details}</span>}
              </div>
              <a href={t.file_url} target="_blank" className="text-sm text-primary-500 underline mt-1 inline-block">
                View Timetable File
              </a>
            </div>
            <button onClick={() => handleDelete(t.id)} className="text-red-600 text-sm">Delete</button>
          </div>
        ))}
        {timetables.length === 0 && <p className="text-gray-500">No timetables added yet.</p>}
      </div>
    </div>
  )
}
