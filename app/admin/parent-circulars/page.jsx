'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const types = ['Notice', 'Important', 'Urgent', 'Event']

export default function AdminParentCirculars() {
  const [circulars, setCirculars] = useState([])
  const [form, setForm] = useState({ title: '', description: '', type: 'Notice' })
  const [editingId, setEditingId] = useState(null)

  const fetchCirculars = async () => {
    const { data } = await supabase
      .from('parent_circulars')
      .select('*')
      .order('created_at', { ascending: false })
    setCirculars(data || [])
  }

  useEffect(() => { fetchCirculars() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = editingId ? `/api/admin/parent-circulars/${editingId}` : '/api/admin/parent-circulars'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include',
    })
    if (res.ok) {
      setForm({ title: '', description: '', type: 'Notice' })
      setEditingId(null)
      fetchCirculars()
    }
  }

  const handleEdit = (item) => {
    setForm({ title: item.title, description: item.description || '', type: item.type })
    setEditingId(item.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return
    await fetch(`/api/admin/parent-circulars/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchCirculars()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Parent Circulars</h2>
      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
        <input type="text" placeholder="Title *" value={form.title}
          onChange={(e) => setForm({...form, title: e.target.value})}
          className="w-full px-4 py-2 border rounded" required />
        <textarea placeholder="Description" value={form.description}
          onChange={(e) => setForm({...form, description: e.target.value})}
          className="w-full px-4 py-2 border rounded" rows="3" />
        <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}
          className="px-4 py-2 border rounded">
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button type="submit" className="btn-primary">
          {editingId ? 'Update' : 'Add'} Circular
        </button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', description: '', type: 'Notice' }) }} className="btn-secondary ml-2">Cancel</button>}
      </form>
      <div className="space-y-4">
        {circulars.map((c) => (
          <div key={c.id} className="card flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm text-gray-600">{c.description?.substring(0, 150)}</p>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{c.type}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(c)} className="text-sm text-blue-600">Edit</button>
              <button onClick={() => handleDelete(c.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
