'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AdminHomework() {
  const [homeworks, setHomeworks] = useState([])
  const [form, setForm] = useState({
    class: '',
    subject: '',
    topic: '',
    due_date: '',
    description: '',
  })
  const [editingId, setEditingId] = useState(null)

  const fetchHomeworks = async () => {
    const { data } = await supabase
      .from('homework')
      .select('*')
      .order('created_at', { ascending: false })
    setHomeworks(data || [])
  }

  useEffect(() => { fetchHomeworks() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = editingId
      ? `/api/admin/homework/${editingId}`
      : '/api/admin/homework'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include',
    })
    if (res.ok) {
      setForm({ class: '', subject: '', topic: '', due_date: '', description: '' })
      setEditingId(null)
      fetchHomeworks()
    }
  }

  const handleEdit = (hw) => {
    setForm({
      class: hw.class,
      subject: hw.subject,
      topic: hw.topic || '',
      due_date: hw.due_date || '',
      description: hw.description || '',
    })
    setEditingId(hw.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return
    await fetch(`/api/admin/homework/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchHomeworks()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Manage Homework</h2>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input type="number" placeholder="Class" value={form.class}
            onChange={(e) => setForm({...form, class: e.target.value})}
            className="w-full px-4 py-2 border rounded" required />
          <input type="text" placeholder="Subject" value={form.subject}
            onChange={(e) => setForm({...form, subject: e.target.value})}
            className="w-full px-4 py-2 border rounded" required />
          <input type="text" placeholder="Topic (optional)" value={form.topic}
            onChange={(e) => setForm({...form, topic: e.target.value})}
            className="w-full px-4 py-2 border rounded" />
          <input type="date" value={form.due_date}
            onChange={(e) => setForm({...form, due_date: e.target.value})}
            className="w-full px-4 py-2 border rounded" />
        </div>
        <textarea placeholder="Description (optional)" value={form.description}
          onChange={(e) => setForm({...form, description: e.target.value})}
          className="w-full px-4 py-2 border rounded" rows="3" />
        <button type="submit" className="btn-primary">
          {editingId ? 'Update' : 'Add'} Homework
        </button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ class: '', subject: '', topic: '', due_date: '', description: '' }) }} className="btn-secondary ml-2">Cancel</button>}
      </form>

      {/* Homework List */}
      <div className="space-y-4">
        {homeworks.map((hw) => (
          <div key={hw.id} className="card flex justify-between items-start">
            <div>
              <h3 className="font-semibold">Class {hw.class} – {hw.subject}</h3>
              {hw.topic && <p className="text-sm text-gray-600">{hw.topic}</p>}
              {hw.due_date && <p className="text-xs text-gray-400">Due: {hw.due_date}</p>}
              {hw.description && <p className="text-sm text-gray-500 mt-1">{hw.description}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(hw)} className="text-sm text-blue-600">Edit</button>
              <button onClick={() => handleDelete(hw.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}
        {homeworks.length === 0 && <p className="text-gray-500">No homework added yet.</p>}
      </div>
    </div>
  )
        }
