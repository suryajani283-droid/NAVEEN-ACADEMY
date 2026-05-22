'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AdminNotes() {
  const [notes, setNotes] = useState([])
  const [form, setForm] = useState({
    subject: '',
    class: '',
    title: '',
    file_url: '',
    type: 'PDF',
  })
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [inputMode, setInputMode] = useState('upload')

  // ✅ TEACHER CLASS DETECTION
  const [teacherClass, setTeacherClass] = useState(null)

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('adminToken='))
      ?.split('=')[1]
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.role === 'teacher' && payload.class) {
          setTeacherClass(payload.class)
        }
      } catch {}
    }
  }, [])

  const fetchNotes = async () => {
    let query = supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })
    if (teacherClass) query = query.eq('class', teacherClass)
    const { data } = await query
    setNotes(data || [])
  }

  useEffect(() => {
    fetchNotes()
  }, [teacherClass])

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
      if (res.ok) {
        setForm({ ...form, file_url: data.url })
      } else {
        alert('Upload failed: ' + data.error)
      }
    } catch (err) {
      alert('Upload error')
    }
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, class: teacherClass || form.class }
    const url = editingId ? `/api/admin/notes/${editingId}` : '/api/admin/notes'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    })
    if (res.ok) {
      setForm({ subject: '', class: teacherClass || '', title: '', file_url: '', type: 'PDF' })
      setEditingId(null)
      setInputMode('upload')
      fetchNotes()
    }
  }

  const handleEdit = (note) => {
    setForm({
      subject: note.subject,
      class: note.class,
      title: note.title || '',
      file_url: note.file_url || '',
      type: note.type || 'PDF',
    })
    setEditingId(note.id)
    setInputMode('link')
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this note?')) return
    await fetch(`/api/admin/notes/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchNotes()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Manage Notes</h2>

      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Subject *" value={form.subject}
            onChange={(e) => setForm({...form, subject: e.target.value})}
            className="w-full px-4 py-2 border rounded" required />
          {!teacherClass && (
            <input type="number" placeholder="Class" value={form.class}
              onChange={(e) => setForm({...form, class: e.target.value})}
              className="w-full px-4 py-2 border rounded" />
          )}
          <input type="text" placeholder="Title / Topic" value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="w-full px-4 py-2 border rounded" />
          <select value={form.type}
            onChange={(e) => setForm({...form, type: e.target.value})}
            className="w-full px-4 py-2 border rounded">
            <option value="PDF">PDF</option>
            <option value="Image">Image</option>
          </select>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="inputMode" value="upload"
              checked={inputMode === 'upload'}
              onChange={() => setInputMode('upload')} />
            Upload File
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="inputMode" value="link"
              checked={inputMode === 'link'}
              onChange={() => setInputMode('link')} />
            Paste Link
          </label>
        </div>

        {inputMode === 'upload' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Choose File (PDF/Image, max 3MB)</label>
            <input type="file" accept=".pdf,image/*" onChange={handleFileUpload}
              className="w-full px-4 py-2 border rounded" />
            {uploading && <span className="text-sm text-primary-500">Uploading...</span>}
            {form.file_url && <p className="text-xs text-green-600">✅ Uploaded</p>}
          </div>
        )}

        {inputMode === 'link' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paste Link (PDF/Image URL)</label>
            <input type="url" placeholder="https://drive.google.com/..."
              value={form.file_url}
              onChange={(e) => setForm({ ...form, file_url: e.target.value })}
              className="w-full px-4 py-2 border rounded" />
          </div>
        )}

        <button type="submit" className="btn-primary">
          {editingId ? 'Update' : 'Add'} Note
        </button>
        {editingId && (
          <button type="button" onClick={() => {
            setEditingId(null)
            setForm({ subject: '', class: teacherClass || '', title: '', file_url: '', type: 'PDF' })
            setInputMode('upload')
          }} className="btn-secondary ml-2">Cancel</button>
        )}
      </form>

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="card flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{note.subject} – {note.title || 'No title'}</h3>
              <p className="text-sm text-gray-600">Class {note.class} | {note.type}</p>
              {note.file_url && (
                <a href={note.file_url} target="_blank" className="text-xs text-primary-500 underline">
                  📎 View/Download
                </a>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(note)} className="text-sm text-blue-600">Edit</button>
              <button onClick={() => handleDelete(note.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}
        {notes.length === 0 && <p className="text-gray-500">No notes added yet.</p>}
      </div>
    </div>
  )
}