'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AdminTeacherAssignments() {
  const [teachers, setTeachers] = useState([])
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [assignments, setAssignments] = useState([])
  const [form, setForm] = useState({ class: '', subject: '' })

  useEffect(() => {
    const fetchTeachers = async () => {
      const { data } = await supabase.from('teachers').select('id, name, class')
      setTeachers(data || [])
    }
    fetchTeachers()
  }, [])

  const fetchAssignments = async () => {
    if (!selectedTeacher) return
    const { data } = await supabase
      .from('teacher_assignments')
      .select('*')
      .eq('teacher_id', selectedTeacher)
    setAssignments(data || [])
  }

  useEffect(() => {
    fetchAssignments()
  }, [selectedTeacher])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!selectedTeacher) return
    const res = await fetch('/api/admin/teacher-assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacher_id: selectedTeacher, ...form }),
      credentials: 'include',
    })
    if (res.ok) {
      setForm({ class: '', subject: '' })
      fetchAssignments()
    }
  }

  const handleDelete = async (id) => {
    await fetch(`/api/admin/teacher-assignments/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchAssignments()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Manage Teacher Assignments</h2>
      
      <div className="card mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Teacher</label>
        <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)} className="w-full px-4 py-2 border rounded">
          <option value="">-- Choose Teacher --</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>{t.name} (Current Class: {t.class})</option>
          ))}
        </select>
      </div>

      {selectedTeacher && (
        <form onSubmit={handleAdd} className="card mb-8 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Class (e.g., 10, XI Arts)" value={form.class}
              onChange={(e) => setForm({...form, class: e.target.value})} className="w-full px-4 py-2 border rounded" required />
            <input type="text" placeholder="Subject (optional)" value={form.subject}
              onChange={(e) => setForm({...form, subject: e.target.value})} className="w-full px-4 py-2 border rounded" />
          </div>
          <button type="submit" className="btn-primary">Add Assignment</button>
        </form>
      )}

      <div className="space-y-2">
        {assignments.map((a) => (
          <div key={a.id} className="card flex justify-between items-center">
            <span>Class: {a.class} {a.subject && `| Subject: ${a.subject}`}</span>
            <button onClick={() => handleDelete(a.id)} className="text-red-600 text-sm">Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}