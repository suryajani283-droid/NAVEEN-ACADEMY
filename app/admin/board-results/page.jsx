'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const classOptions = ['10', '11', '12']

export default function AdminBoardResults() {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState({
    name: '',
    achievement: '',
    class: '10',
    img: '/images/default-avatar.png',
  })
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [inputMode, setInputMode] = useState('upload')

  const fetchStudents = async () => {
    const { data } = await supabase
      .from('board_results')
      .select('*')
      .order('created_at', { ascending: false })
    setStudents(data || [])
  }

  useEffect(() => { fetchStudents() }, [])

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) {
      alert('File size must be less than 3MB')
      return
    }
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: fd,
        credentials: 'include',
      })
      const data = await res.json()
      if (res.ok) setForm({ ...form, img: data.url })
      else alert('Upload failed: ' + data.error)
    } catch (err) {
      alert('Upload error')
    }
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = editingId
      ? `/api/admin/board-results/${editingId}`
      : '/api/admin/board-results'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include',
    })
    if (res.ok) {
      setForm({ name: '', achievement: '', class: '10', img: '/images/default-avatar.png' })
      setEditingId(null)
      setInputMode('upload')
      fetchStudents()
    } else {
      const err = await res.json()
      alert('Error: ' + err.error)
    }
  }

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      achievement: student.achievement,
      class: student.class,
      img: student.img,
    })
    setEditingId(student.id)
    setInputMode('link')
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return
    await fetch(`/api/admin/board-results/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    fetchStudents()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Manage Board Results</h2>

      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          {editingId ? 'Edit Student' : 'Add New Student'}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Student Name *" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 border rounded" required />
          <input type="text" placeholder="Achievement *" value={form.achievement}
            onChange={(e) => setForm({ ...form, achievement: e.target.value })}
            className="w-full px-4 py-2 border rounded" required />
          <select value={form.class}
            onChange={(e) => setForm({ ...form, class: e.target.value })}
            className="w-full px-4 py-2 border rounded">
            {classOptions.map(c => <option key={c} value={c}>Class {c}</option>)}
          </select>
        </div>

        {/* Image upload / link toggle */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="inputMode" value="upload"
              checked={inputMode === 'upload'}
              onChange={() => setInputMode('upload')} /> Upload Photo
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="inputMode" value="link"
              checked={inputMode === 'link'}
              onChange={() => setInputMode('link')} /> Paste Link
          </label>
        </div>

        {inputMode === 'upload' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Choose Photo (max 3MB)</label>
            <input type="file" accept="image/*" onChange={handleFileUpload}
              className="w-full px-4 py-2 border rounded" />
            {uploading && <span className="text-sm text-primary-500">Uploading...</span>}
            {form.img && <p className="text-xs text-green-600">✅ Uploaded</p>}
          </div>
        )}

        {inputMode === 'link' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paste Image URL</label>
            <input type="url" placeholder="https://..."
              value={form.img}
              onChange={(e) => setForm({ ...form, img: e.target.value })}
              className="w-full px-4 py-2 border rounded" />
          </div>
        )}

        <button type="submit" className="btn-primary">
          {editingId ? 'Update' : 'Add'} Student
        </button>
        {editingId && (
          <button type="button" onClick={() => {
            setEditingId(null)
            setForm({ name: '', achievement: '', class: '10', img: '/images/default-avatar.png' })
            setInputMode('upload')
          }} className="btn-secondary ml-2">Cancel</button>
        )}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {students.map((s) => (
          <div key={s.id} className="card text-center">
            <img src={s.img} alt={s.name} className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-2 border-primary-200" />
            <h3 className="font-semibold">{s.name}</h3>
            <p className="text-sm text-gray-600">{s.achievement}</p>
            <p className="text-xs text-primary-500 mt-1">Class {s.class}</p>
            <div className="flex gap-2 justify-center mt-3">
              <button onClick={() => handleEdit(s)} className="text-sm text-blue-600">Edit</button>
              <button onClick={() => handleDelete(s.id)} className="text-sm text-red-600">Remove</button>
            </div>
          </div>
        ))}
        {students.length === 0 && (
          <p className="col-span-3 text-center text-gray-500 py-8">No students added yet.</p>
        )}
      </div>
    </div>
  )
}