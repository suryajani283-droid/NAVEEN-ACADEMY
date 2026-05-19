'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AdminNotes() {
  const [notes, setNotes] = useState([])
  const [form, setForm] = useState({ subject: '', class: '', title: '', file_url: '', type: 'PDF' })

  const fetchNotes = async () => {
    const { data } = await supabase.from('notes').select('*').order('created_at', { ascending: false })
    setNotes(data || [])
  }

  useEffect(() => { fetchNotes() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch('/api/admin/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include',
    })
    setForm({ subject: '', class: '', title: '', file_url: '', type: 'PDF' })
    fetchNotes()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return
    await fetch(`/api/admin/notes/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchNotes()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Manage Notes</h2>
      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Subject" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} className="w-full px-4 py-2 border rounded" required />
          <input type="number" placeholder="Class" value={form.class} onChange={(e) => setForm({...form, class: e.target.value})} className="w-full px-4 py-2 border rounded" />
          <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full px-4 py-2 border rounded" />
          <input type="text" placeholder="File URL" value={form.file_url} onChange={(e) => setForm({...form, file_url: e.target.value})} className="w-full px-4 py-2 border rounded" />
        </div>
        <button type="submit" className="btn-primary">Add Note</button>
      </form>
      <div className="space-y-4">
        {notes.map((n) => (
          <div key={n.id} className="card flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{n.subject} – {n.title}</h3>
              <p className="text-sm text-gray-600">Class {n.class} | {n.type}</p>
            </div>
            <button onClick={() => handleDelete(n.id)} className="text-sm text-red-600">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
