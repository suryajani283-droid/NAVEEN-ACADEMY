'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([])
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const fetchTeachers = async () => {
    const { data, error } = await supabase.from('teachers').select('id, name, email')
    if (!error) setTeachers(data || [])
  }

  useEffect(() => { fetchTeachers() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/admin/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include',
    })
    if (res.ok) {
      const data = await res.json()
      alert('Teacher added successfully!')
      setForm({ name: '', email: '', password: '' })
      fetchTeachers()
    } else {
      const err = await res.json()
      alert('Error: ' + err.error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove teacher?')) return
    await fetch(`/api/admin/teachers/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchTeachers()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Manage Teachers</h2>

      <form onSubmit={handleAdd} className="card mb-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Add New Teacher</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Full Name" value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            className="w-full px-4 py-2 border rounded" required />
          <input type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            className="w-full px-4 py-2 border rounded" required />
          <input type="password" placeholder="Temporary password" value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            className="w-full px-4 py-2 border rounded" required />
        </div>
        <button type="submit" className="btn-primary">Add Teacher</button>
      </form>

      <div className="space-y-2">
        {teachers.length === 0 && <p className="text-gray-500">No teachers added yet.</p>}
        {teachers.map((t) => (
          <div key={t.id} className="card flex justify-between items-center">
            <div>
              <strong>{t.name}</strong> ({t.email})
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/teacher-assignments?teacherId=${t.id}`}
                className="text-sm text-blue-600 hover:text-blue-800">
                Assign Classes
              </Link>
              <button onClick={() => handleDelete(t.id)} className="text-sm text-red-600">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}