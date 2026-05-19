'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const categories = ['General', 'Syllabus', 'Prospectus', 'Forms', 'Timetable', 'Other']

export default function AdminDownloads() {
  const [downloads, setDownloads] = useState([])
  const [form, setForm] = useState({
    title: '',
    category: 'General',
    file_url: '',
    type: 'PDF',
  })
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [inputMode, setInputMode] = useState('upload') // 'upload' or 'link'

  const fetchDownloads = async () => {
    const { data } = await supabase
      .from('downloads')
      .select('*')
      .order('created_at', { ascending: false })
    setDownloads(data || [])
  }

  useEffect(() => { fetchDownloads() }, [])

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
      if (res.ok) setForm({ ...form, file_url: data.url })
      else alert('Upload failed: ' + data.error)
    } catch (err) {
      alert('Upload error')
    }
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = editingId ? `/api/admin/downloads/${editingId}` : '/api/admin/downloads'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include',
    })
    if (res.ok) {
      setForm({ title: '', category: 'General', file_url: '', type: 'PDF' })
      setEditingId(null)
      setInputMode('upload')
      fetchDownloads()
    }
  }

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      category: item.category,
      file_url: item.file_url,
      type: item.type || 'PDF',
    })
    setEditingId(item.id)
    setInputMode('link')
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return
    await fetch(`/api/admin/downloads/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchDownloads()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Manage Downloads</h2>

      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Title *" value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="w-full px-4 py-2 border rounded" required />
          <select value={form.category}
            onChange={(e) => setForm({...form, category: e.target.value})}
            className="w-full px-4 py-2 border rounded">
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={form.type}
            onChange={(e) => setForm({...form, type: e.target.value})}
            className="w-full px-4 py-2 border rounded">
            <option value="PDF">PDF</option>
            <option value="Image">Image</option>
          </select>
        </div>

        {/* Upload / Link Toggle */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="inputMode" value="upload"
              checked={inputMode === 'upload'}
              onChange={() => setInputMode('upload')} /> Upload File
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="inputMode" value="link"
              checked={inputMode === 'link'}
              onChange={() => setInputMode('link')} /> Paste Link
          </label>
        </div>

        {inputMode === 'upload' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Choose File (PDF/Image, max 3MB)</label>
            <input type="file" accept=".pdf,image/*" onChange={handleFileUpload}
              className="w-full px-4 py-2 border rounded" />
            {uploading && <span className="text-sm text-primary-500">Uploading...</span>}
            {form.file_url && <p className="text-xs text-green-600">✅ Uploaded: {form.file_url.substring(0, 50)}...</p>}
          </div>
        )}

        {inputMode === 'link' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paste Link (PDF/Image URL)</label>
            <input type="url" placeholder="https://..."
              value={form.file_url}
              onChange={(e) => setForm({ ...form, file_url: e.target.value })}
              className="w-full px-4 py-2 border rounded" />
          </div>
        )}

        <button type="submit" className="btn-primary">
          {editingId ? 'Update' : 'Add'} Download
        </button>
        {editingId && <button type="button" onClick={() => {
          setEditingId(null); setForm({ title: '', category: 'General', file_url: '', type: 'PDF' }); setInputMode('upload')
        }} className="btn-secondary ml-2">Cancel</button>}
      </form>

      {/* List */}
      <div className="space-y-4">
        {downloads.map((item) => (
          <div key={item.id} className="card flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.category} | {item.type}</p>
              {item.file_url && <a href={item.file_url} target="_blank" className="text-xs text-primary-500 underline">📎 View/Download</a>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(item)} className="text-sm text-blue-600">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}
        {downloads.length === 0 && <p className="text-gray-500">No downloads added yet.</p>}
      </div>
    </div>
  )
          }
