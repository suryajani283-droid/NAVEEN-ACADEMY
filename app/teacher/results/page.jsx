'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const gradeScale = (pct) => {
  if (pct >= 90) return 'A+'
  if (pct >= 80) return 'A'
  if (pct >= 70) return 'B'
  if (pct >= 60) return 'C'
  if (pct >= 50) return 'D'
  return 'F'
}

export default function TeacherResults() {
  const [teacherClass, setTeacherClass] = useState(null)
  const [results, setResults] = useState([])
  const [form, setForm] = useState({
    student_name: '',
    father_name: '',
    roll_number: '',
    dob: '',
    exam_type: 'Half Yearly',
    email: '',
    subjects: [],
  })
  const [newSubject, setNewSubject] = useState({ name: '', obtained: '', max: '' })
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

  const fetchResults = async () => {
    if (!teacherClass) return
    const { data } = await supabase
      .from('results')
      .select('*')
      .eq('class', teacherClass)
      .order('roll_number')
    setResults(data || [])
  }

  useEffect(() => { if (teacherClass) fetchResults() }, [teacherClass])

  const addSubject = () => {
    if (!newSubject.name || !newSubject.obtained || !newSubject.max) return
    setForm({
      ...form,
      subjects: [...form.subjects, { ...newSubject, obtained: Number(newSubject.obtained), max: Number(newSubject.max) }],
    })
    setNewSubject({ name: '', obtained: '', max: '' })
  }

  const removeSubject = (idx) => {
    setForm({ ...form, subjects: form.subjects.filter((_, i) => i !== idx) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const subjectsObj = {}
    form.subjects.forEach(s => { subjectsObj[s.name] = { obtained: s.obtained, max: s.max } })
    const totalObtained = form.subjects.reduce((sum, s) => sum + s.obtained, 0)
    const totalMax = form.subjects.reduce((sum, s) => sum + s.max, 0)
    const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 10000) / 100 : 0
    const grade = gradeScale(percentage)

    const payload = {
      student_name: form.student_name,
      father_name: form.father_name,
      class: teacherClass,
      roll_number: form.roll_number,
      dob: form.dob,
      exam_type: form.exam_type,
      email: form.email,
      subjects: subjectsObj,
      total: totalObtained,
      total_max: totalMax,
      percentage,
      grade,
    }

    const url = editingId ? `/api/admin/results/${editingId}` : '/api/admin/results'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    })
    if (res.ok) {
      setForm({ student_name: '', father_name: '', roll_number: '', dob: '', exam_type: 'Half Yearly', email: '', subjects: [] })
      setEditingId(null)
      fetchResults()
    } else {
      alert('Error saving result')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return
    await fetch(`/api/admin/results/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchResults()
  }

  if (!teacherClass) return <div className="pt-20 text-center">Loading...</div>

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-2">Results for Class {teacherClass}</h2>

      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Student Name" value={form.student_name}
            onChange={(e) => setForm({ ...form, student_name: e.target.value })}
            className="w-full px-4 py-2 border rounded" required />
          <input type="text" placeholder="Father's Name" value={form.father_name}
            onChange={(e) => setForm({ ...form, father_name: e.target.value })}
            className="w-full px-4 py-2 border rounded" />
          <input type="text" placeholder="Roll Number" value={form.roll_number}
            onChange={(e) => setForm({ ...form, roll_number: e.target.value })}
            className="w-full px-4 py-2 border rounded" required />
          <input type="date" placeholder="DOB" value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
            className="w-full px-4 py-2 border rounded" required />
          <select value={form.exam_type} onChange={(e) => setForm({ ...form, exam_type: e.target.value })}
            className="w-full px-4 py-2 border rounded">
            <option>Half Yearly</option>
            <option>Yearly</option>
            <option>Test</option>
          </select>
          <input type="email" placeholder="Student Email (optional)" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subjects (Obtained / Max)</label>
          <div className="flex gap-2 mb-2">
            <input type="text" placeholder="Subject" value={newSubject.name}
              onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
              className="flex-1 px-4 py-2 border rounded" />
            <input type="number" placeholder="Obtained" value={newSubject.obtained}
              onChange={(e) => setNewSubject({ ...newSubject, obtained: e.target.value })}
              className="w-24 px-4 py-2 border rounded" />
            <input type="number" placeholder="Max" value={newSubject.max}
              onChange={(e) => setNewSubject({ ...newSubject, max: e.target.value })}
              className="w-24 px-4 py-2 border rounded" />
            <button type="button" onClick={addSubject} className="btn-primary py-2 px-4">Add</button>
          </div>
          {form.subjects.map((s, idx) => (
            <div key={idx} className="flex justify-between bg-gray-100 p-2 rounded mb-1">
              <span>{s.name} – {s.obtained} / {s.max}</span>
              <button onClick={() => removeSubject(idx)} className="text-red-600">Remove</button>
            </div>
          ))}
        </div>
        <button type="submit" className="btn-primary">
          {editingId ? 'Update' : 'Add'} Result
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-xl shadow">
          <thead>
            <tr className="bg-primary-500 text-white">
              <th className="p-3">Name</th>
              <th className="p-3">Roll</th>
              <th className="p-3">Total</th>
              <th className="p-3">%</th>
              <th className="p-3">Grade</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res) => (
              <tr key={res.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{res.student_name}</td>
                <td className="p-3">{res.roll_number}</td>
                <td className="p-3">{res.total} / {res.total_max || '?'}</td>
                <td className="p-3">{res.percentage}%</td>
                <td className="p-3">{res.grade}</td>
                <td className="p-3"><button onClick={() => handleDelete(res.id)} className="text-red-600">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}