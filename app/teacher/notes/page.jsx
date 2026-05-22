'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function TeacherNotes() {
  const [teacherClass, setTeacherClass] = useState(null)
  const [notes, setNotes] = useState([])
  const [form, setForm] = useState({ subject: '', title: '', file_url: '', type: 'PDF' })
  const [editingId, setEditingId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchTeacher = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/teacher-login'); return }
      const { data: teacher } = await supabase
        .from('teachers')
        .select('class')
        .eq('id', user.id)
        .single()
      if (!teacher) { router.push('/teacher-login'); return }
      setTeacherClass(teacher.class)
    }
    fetchTeacher()
  }, [router])

  const fetchNotes = async () => {
    if (!teacherClass) return
    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('class', teacherClass)
      .order('created_at', { ascending: false })
    setNotes(data || [])
  }

  useEffect(() => { if (teacherClass) fetchNotes() }, [teacherClass])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, class: teacherClass }
    const url = editingId ? `/api/admin/notes/${editingId}` : '/api/admin/notes'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    })
    if (res.ok) {
      setForm({ subject: '', title: '', file_url: '', type: 'PDF' })
      setEditingId(null)
      fetchNotes()
    } else {
      alert('Error saving note')
    }
  }

  const handleEdit = (note) => {
    setForm({ subject: note.subject, title: note.title || '', file_url: note.file_url || '', type: note.type || 'PDF' })
    setEditingId(note.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return
    await fetch(`/api/admin/notes/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchNotes()
  }

  if (!teacherClass) return <div className="pt-20 text-center">Loading...</div>

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-2">Notes for Class {teacherClass}</h2>
      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
        <input type="text" placeholder="Subject" value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full px-4 py-2 border rounded" required />
        <input type="text" placeholder="Title" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-2 border rounded" />
        <input type="text" placeholder="File URL" value={form.file_url}
          onChange={(e) => setForm({ ...form, file_url: e.target.value })}
          className="w-full px-4 py-2 border rounded" />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full px-4 py-2 border rounded">
          <option value="PDF">PDF</option>
          <option value="Image">Image</option>
        </select>
        <button type="submit" className="btn-primary">
          {editingId ? 'Update' : 'Add'} Note
        </button>
      </form>
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="card flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{note.subject} – {note.title || 'No Title'}</h3>
              <p className="text-sm text-gray-500">Type: {note.type}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(note)} className="text-sm text-blue-600">Edit</button>
              <button onClick={() => handleDelete(note.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}