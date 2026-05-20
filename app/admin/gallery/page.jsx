'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const categories = ['Events', 'Sports', 'Labs', 'Annual Function', 'Tours', 'Classroom']

export default function AdminGallery() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title: '', category: 'Events', image_url: '' })
  const [uploading, setUploading] = useState(false)
  const [inputMode, setInputMode] = useState('upload') // 'upload' or 'link'

  const fetchItems = async () => {
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => { fetchItems() }, [])

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
      if (res.ok) setForm({ ...form, image_url: data.url })
      else alert('Upload failed: ' + data.error)
    } catch (err) {
      alert('Upload error')
    }
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include',
    })
    if (res.ok) {
      setForm({ title: '', category: 'Events', image_url: '' })
      fetchItems()
    } else {
      const err = await res.json()
      alert('Error: ' + err.error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return
    await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchItems()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Manage Gallery</h2>

      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Title *" value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="w-full px-4 py-2 border rounded" required />
          <select value={form.category}
            onChange={(e) => setForm({...form, category: e.target.value})}
            className="w-full px-4 py-2 border rounded">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
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
            <label className="block text-sm font-medium text-gray-700">Choose Image (max 3MB)</label>
            <input type="file" accept="image/*" onChange={handleFileUpload}
              className="w-full px-4 py-2 border rounded" />
            {uploading && <span className="text-sm text-primary-500">Uploading...</span>}
            {form.image_url && (
              <p className="text-xs text-green-600">✅ Uploaded: {form.image_url.substring(0, 50)}...</p>
            )}
          </div>
        )}

        {inputMode === 'link' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paste Image URL</label>
            <input type="url" placeholder="https://..."
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="w-full px-4 py-2 border rounded" />
          </div>
        )}

        <button type="submit" className="btn-primary">Add Image</button>
      </form>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="relative group overflow-hidden rounded-xl shadow-lg">
            <img src={item.image_url} alt={item.title} className="h-48 w-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm font-semibold">{item.title}</p>
              <p className="text-white/80 text-xs">{item.category}</p>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600 transition"
            >
              ✕
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-4 text-center py-12 text-gray-500">No images in gallery yet.</div>
        )}
      </div>
    </div>
  )
        }
