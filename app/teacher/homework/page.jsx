'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function TeacherHomework() {
  const searchParams = useSearchParams()
  const teacherClass = searchParams.get('class') || ''
  const subject = searchParams.get('subject') || ''
  const router = useRouter()

  const [homeworks, setHomeworks] = useState([])
  const [form, setForm] = useState({
    subject: subject || '',
    topic: '',
    due_date: '',
    description: '',
    file_url: '',
    type: 'PDF',
  })
  const [editingId, setEditingId] = useState(null)

  // Redirect to class selection if no class is provided
  useEffect(() => {
    if (!teacherClass) {
      router.push('/teacher/select-class')
    }
  }, [teacherClass, router])

  const fetchHomeworks = async () => {
    if (!teacherClass) return
    let query = supabase
      .from('homework')
      .select('*')
      .eq('class', teacherClass)
      .order('created_at', { ascending: false })

    if (subject) {
      query = query.eq('subject', subject)
    }
    const { data } = await query
    setHomeworks(data || [])
  }

  useEffect(() => {
    fetchHomeworks()
  }, [teacherClass, subject])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      class: teacherClass,
    }
    const url = editingId
      ? `/api/admin/homework/${editingId}`
      : '/api/admin/homework'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    })
    if (res.ok) {
      setForm({ subject: subject || '', topic: '', due_date: '', description: '', file_url: '', type: 'PDF' })
      setEditingId(null)
      fetchHomeworks()
    } else {
      alert('Error saving homework')
    }
  }

  const handleEdit = (hw) => {
    setForm({
      subject: hw.subject,
      topic: hw.topic || '',
      due_date: hw.due_date || '',
      description: hw.description || '',
      file_url: hw.file_url || '',
      type: hw.type || 'PDF',
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
      <h2 className="text-3xl font-bold text-primary-500 mb-2">
        Homework – Class {teacherClass}
        {subject ? ` (${subject})` : ''}
      </h2>

      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {!subject && (
            <input type="text" placeholder="Subject" value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-4 py-2 border rounded" required />
          )}
          <input type="text" placeholder="Topic (optional)" value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
            className="w-full px-4 py-2 border rounded" />
          <input type="date" value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            className="w-full px-4 py-2 border rounded" />
          <select value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full px-4 py-2 border rounded">
            <option value="PDF">PDF</option>
            <option value="Image">Image</option>
          </select>
        </div>
        <textarea placeholder="Description (optional)" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-4 py-2 border rounded" rows="3" />
        <button type="submit" className="btn-primary">
          {editingId ? 'Update' : 'Add'} Homework
        </button>
        {editingId && (
          <button type="button" onClick={() => {
            setEditingId(null)
            setForm({ subject: subject || '', topic: '', due_date: '', description: '', file_url: '', type: 'PDF' })
          }} className="btn-secondary ml-2">Cancel</button>
        )}
      </form>

      <div className="space-y-4">
        {homeworks.map((hw) => (
          <div key={hw.id} className="card flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{hw.subject} – {hw.topic || 'No Topic'}</h3>
              {hw.description && <p className="text-sm text-gray-600">{hw.description}</p>}
              {hw.due_date && <p className="text-xs text-gray-400">Due: {hw.due_date}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(hw)} className="text-sm text-blue-600">Edit</button>
              <button onClick={() => handleDelete(hw.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}
        {homeworks.length === 0 && (
          <p className="text-gray-500 text-center py-8">No homework for this class yet.</p>
        )}
      </div>
    </div>
  )
}