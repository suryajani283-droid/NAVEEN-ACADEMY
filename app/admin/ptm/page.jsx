'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AdminPTM() {
  const [ptms, setPtms] = useState([])
  const [form, setForm] = useState({ class_range: '', date: '', time: '', venue: '' })
  const [editingId, setEditingId] = useState(null)

  const fetchPTMs = async () => {
    const { data } = await supabase
      .from('ptm_announcements')
      .select('*')
      .order('created_at', { ascending: false })
    setPtms(data || [])
  }

  useEffect(() => { fetchPTMs() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = editingId ? `/api/admin/ptm/${editingId}` : '/api/admin/ptm'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include',
    })
    if (res.ok) {
      setForm({ class_range: '', date: '', time: '', venue: '' })
      setEditingId(null)
      fetchPTMs()
    }
  }

  const handleEdit = (ptm) => {
    setForm({ class_range: ptm.class_range || '', date: ptm.date || '', time: ptm.time || '', venue: ptm.venue || '' })
    setEditingId(ptm.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return
    await fetch(`/api/admin/ptm/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchPTMs()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">PTM Announcements</h2>
      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
        <input type="text" placeholder="Class Range (e.g., VI-VIII)" value={form.class_range}
          onChange={(e) => setForm({...form, class_range: e.target.value})}
          className="w-full px-4 py-2 border rounded" required />
        <div className="grid md:grid-cols-2 gap-4">
          <input type="date" value={form.date}
            onChange={(e) => setForm({...form, date: e.target.value})}
            className="w-full px-4 py-2 border rounded" required />
          <input type="text" placeholder="Time (e.g., 9:00 AM - 11:00 AM)" value={form.time}
            onChange={(e) => setForm({...form, time: e.target.value})}
            className="w-full px-4 py-2 border rounded" required />
        </div>
        <input type="text" placeholder="Venue" value={form.venue}
          onChange={(e) => setForm({...form, venue: e.target.value})}
          className="w-full px-4 py-2 border rounded" />
        <button type="submit" className="btn-primary">
          {editingId ? 'Update' : 'Add'} PTM
        </button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ class_range: '', date: '', time: '', venue: '' }) }} className="btn-secondary ml-2">Cancel</button>}
      </form>
      <div className="space-y-4">
        {ptms.map((ptm) => (
          <div key={ptm.id} className="card flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{ptm.class_range}</h3>
              <p className="text-sm text-gray-600">{ptm.date} | {ptm.time}</p>
              {ptm.venue && <p className="text-xs text-gray-400">Venue: {ptm.venue}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(ptm)} className="text-sm text-blue-600">Edit</button>
              <button onClick={() => handleDelete(ptm.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
