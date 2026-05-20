'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const classes = [1,2,3,4,5,6,7,8,9,10,11,12]

const gradeScale = (pct) => {
  if (pct >= 90) return 'A+'
  if (pct >= 80) return 'A'
  if (pct >= 70) return 'B'
  if (pct >= 60) return 'C'
  if (pct >= 50) return 'D'
  return 'F'
}

export default function AdminResults() {
  const [selectedClass, setSelectedClass] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    student_name: '',
    father_name: '',
    roll_number: '',
    dob: '',
    exam_type: 'Half Yearly',
    email: '',
    subjects: [],
  })
  const [newSubject, setNewSubject] = useState({ name: '', marks: '' })

  const fetchResults = async () => {
    if (!selectedClass) return
    setLoading(true)
    const { data } = await supabase
      .from('results')
      .select('*')
      .eq('class', selectedClass)
      .order('roll_number')
    setResults(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchResults()
  }, [selectedClass])

  const addSubject = () => {
    if (!newSubject.name || !newSubject.marks) return
    setForm({
      ...form,
      subjects: [...form.subjects, { name: newSubject.name, marks: Number(newSubject.marks) }],
    })
    setNewSubject({ name: '', marks: '' })
  }

  const removeSubject = (idx) => {
    setForm({ ...form, subjects: form.subjects.filter((_, i) => i !== idx) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedClass) return

    const subjectsObj = {}
    form.subjects.forEach(s => { subjectsObj[s.name] = s.marks })

    const total = form.subjects.reduce((sum, s) => sum + s.marks, 0)
    const percentage = form.subjects.length ? (total / (form.subjects.length * 100)) * 100 : 0
    const grade = gradeScale(percentage)

    const payload = {
      student_name: form.student_name,
      father_name: form.father_name,
      class: Number(selectedClass),
      roll_number: form.roll_number,
      dob: form.dob,
      exam_type: form.exam_type,
      email: form.email,
      subjects: subjectsObj,
      total,
      percentage: Math.round(percentage * 100) / 100,
      grade,
    }

    const res = await fetch('/api/admin/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    })
    if (res.ok) {
      alert('Result added successfully!')
      setForm({ student_name: '', father_name: '', roll_number: '', dob: '', exam_type: 'Half Yearly', email: '', subjects: [] })
      fetchResults()
    } else {
      const err = await res.json()
      alert('Error: ' + err.error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this result?')) return
    await fetch(`/api/admin/results/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchResults()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Manage Results</h2>

      <div className="card mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="px-4 py-2 border rounded">
          <option value="">-- Choose Class --</option>
          {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
        </select>
      </div>

      {selectedClass && (
        <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
          <h3 className="text-xl font-semibold text-primary-500">Add New Result (Class {selectedClass})</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Student Name *" value={form.student_name}
              onChange={(e) => setForm({ ...form, student_name: e.target.value })}
              className="w-full px-4 py-2 border rounded" required />
            <input type="text" placeholder="Father's Name" value={form.father_name}
              onChange={(e) => setForm({ ...form, father_name: e.target.value })}
              className="w-full px-4 py-2 border rounded" />
            <input type="text" placeholder="Roll Number *" value={form.roll_number}
              onChange={(e) => setForm({ ...form, roll_number: e.target.value })}
              className="w-full px-4 py-2 border rounded" required />
            <input type="date" placeholder="Date of Birth *" value={form.dob}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Subjects & Marks</label>
            <div className="flex gap-2 mb-2">
              <input type="text" placeholder="Subject" value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                className="flex-grow px-4 py-2 border rounded" />
              <input type="number" placeholder="Marks" value={newSubject.marks}
                onChange={(e) => setNewSubject({ ...newSubject, marks: e.target.value })}
                className="w-24 px-4 py-2 border rounded" />
              <button type="button" onClick={addSubject} className="btn-primary py-2 px-4">Add</button>
            </div>
            {form.subjects.map((s, idx) => (
              <div key={idx} className="flex justify-between bg-gray-100 p-2 rounded mb-1">
                <span>{s.name} – {s.marks}</span>
                <button type="button" onClick={() => removeSubject(idx)} className="text-red-600">Remove</button>
              </div>
            ))}
          </div>

          <button type="submit" className="btn-primary">Submit Result</button>
        </form>
      )}

      {loading && <p className="text-gray-500">Loading...</p>}
      {selectedClass && !loading && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-primary-500 text-white">
                <th className="p-3">Name</th>
                <th className="p-3">Father</th>
                <th className="p-3">Roll</th>
                <th className="p-3">DOB</th>
                <th className="p-3">Exam</th>
                <th className="p-3">Total</th>
                <th className="p-3">%</th>
                <th className="p-3">Grade</th>
                <th className="p-3">Delete</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res) => (
                <tr key={res.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{res.student_name}</td>
                  <td className="p-3">{res.father_name}</td>
                  <td className="p-3">{res.roll_number}</td>
                  <td className="p-3">{res.dob}</td>
                  <td className="p-3">{res.exam_type}</td>
                  <td className="p-3">{res.total}</td>
                  <td className="p-3">{res.percentage}%</td>
                  <td className="p-3">{res.grade}</td>
                  <td className="p-3"><button onClick={() => handleDelete(res.id)} className="text-red-600 text-sm">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
    }
