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
    file_url: '',
    type: 'PDF',
  })
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [inputMode, setInputMode] = useState('upload') // 'upload' or 'link'

  const fetchHomeworks = async () => {
    const { data } = await supabase
      .from('homework')
      .select('*')
      .order('created_at', { ascending: false })
    setHomeworks(data || [])
  }

  useEffect(() => { fetchHomeworks() }, [])

  // फ़ाइल अपलोड हैंडलर
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
    const url = editingId ? `/api/admin/homework/${editingId}` : '/api/admin/homework'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include',
    })
    if (res.ok) {
      setForm({ class: '', subject: '', topic: '', due_date: '', description: '', file_url: '', type: 'PDF' })
      setEditingId(null)
      setInputMode('upload')
      fetchHomeworks()

      // ✅ Trigger push notification after successful save
      const action = editingId ? 'updated' : 'added'
      fetch('/api/push/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '📝 Homework Update',
          body: `Homework ${action} for Class ${form.class}: ${form.subject}`,
          url: '/student-corner?tab=homework',
          targetClass: form.class || null,
        }),
        credentials: 'include',
      }).catch(console.error)
    }
  }

  const handleEdit = (hw) => {
    setForm({
      class: hw.class,
      subject: hw.subject,
      topic: hw.topic || '',
      due_date: hw.due_date || '',
      description: hw.description || '',
      file_url: hw.file_url || '',
      type: hw.type || 'PDF',
    })
    setEditingId(hw.id)
    setInputMode('link') // एडिट करते समय लिंक मोड दिखाएँ ताकि URL एडिट हो सके
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return
    await fetch(`/api/admin/homework/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchHomeworks()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Manage Homework</h2>

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
          <select value={form.type}
            onChange={(e) => setForm({...form, type: e.target.value})}
            className="w-full px-4 py-2 border rounded">
            <option value="PDF">PDF</option>
            <option value="Image">Image</option>
          </select>
        </div>

        {/* ---- Input Mode Toggle ---- */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="inputMode"
              value="upload"
              checked={inputMode === 'upload'}
              onChange={() => setInputMode('upload')}
            />
            Upload File
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="inputMode"
              value="link"
              checked={inputMode === 'link'}
              onChange={() => setInputMode('link')}
            />
            Paste Link
          </label>
        </div>

        {/* ---- Upload Mode ---- */}
        {inputMode === 'upload' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Choose File (PDF/Image, max 3MB)
            </label>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border rounded"
            />
            {uploading && <span className="text-sm text-primary-500">Uploading...</span>}
            {form.file_url && (
              <p className="text-xs text-green-600">
                ✅ Uploaded: {form.file_url.substring(0, 50)}...
              </p>
            )}
          </div>
        )}

        {/* ---- Link Mode ---- */}
        {inputMode === 'link' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste Link (PDF/Image URL)
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/..."
              value={form.file_url}
              onChange={(e) => setForm({ ...form, file_url: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
        )}

        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({...form, description: e.target.value})}
          className="w-full px-4 py-2 border rounded" rows="3"
        />

        <button type="submit" className="btn-primary">
          {editingId ? 'Update' : 'Add'} Homework
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null)
              setForm({ class: '', subject: '', topic: '', due_date: '', description: '', file_url: '', type: 'PDF' })
              setInputMode('upload')
            }}
            className="btn-secondary ml-2"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Homework List (unchanged) */}
      <div className="space-y-4">
        {homeworks.map((hw) => (
          <div key={hw.id} className="card flex justify-between items-start">
            <div>
              <h3 className="font-semibold">Class {hw.class} – {hw.subject}</h3>
              {hw.topic && <p className="text-sm text-gray-600">{hw.topic}</p>}
              {hw.due_date && <p className="text-xs text-gray-400">Due: {hw.due_date}</p>}
              {hw.description && <p className="text-sm text-gray-500 mt-1">{hw.description}</p>}
              {hw.file_url && (
                <a href={hw.file_url} target="_blank" className="text-xs text-primary-500 underline">
                  📎 {hw.type} View/Download
                </a>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(hw)} className="text-sm text-blue-600">Edit</button>
              <button onClick={() => handleDelete(hw.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}