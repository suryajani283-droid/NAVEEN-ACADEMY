'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AdminAdvertisements() {
  const [ads, setAds] = useState([])
  const [form, setForm] = useState({ image_url: '', title: '', link_url: '' })
  const [uploading, setUploading] = useState(false)
  const [inputMode, setInputMode] = useState('upload')
  const [editingId, setEditingId] = useState(null)

  const fetchAds = async () => {
    const { data } = await supabase
      .from('advertisements')
      .select('*')
      .order('created_at', { ascending: false })
    setAds(data || [])
  }

  useEffect(() => { fetchAds() }, [])

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
    const url = editingId
      ? `/api/admin/advertisements/${editingId}`
      : '/api/admin/advertisements'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include',
    })
    if (res.ok) {
      setForm({ image_url: '', title: '', link_url: '' })
      setEditingId(null)
      fetchAds()
    } else {
      const text = await res.text()
      let msg = text
      try { const json = JSON.parse(text); msg = json.error || text } catch {}
      alert('Error (' + res.status + '): ' + msg)
    }
  }

  const handleEdit = (ad) => {
    setForm({
      image_url: ad.image_url,
      title: ad.title || '',
      link_url: ad.link_url || '',
    })
    setEditingId(ad.id)
    setInputMode('link')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this advertisement?')) return
    const res = await fetch(`/api/admin/advertisements/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (res.ok) {
      fetchAds()
    } else {
      const text = await res.text()
      let msg = text
      try { const json = JSON.parse(text); msg = json.error || text } catch {}
      alert('Delete failed (' + res.status + '): ' + msg)
    }
  }

  const cancelEdit = () => {
    setForm({ image_url: '', title: '', link_url: '' })
    setEditingId(null)
    setInputMode('upload')
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Manage Advertisements</h2>

      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          {editingId ? 'Edit Advertisement' : 'Add New Advertisement'}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Title (optional)" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 border rounded" />
          <input type="url" placeholder="Click-through link (optional)" value={form.link_url}
            onChange={(e) => setForm({ ...form, link_url: e.target.value })}
            className="w-full px-4 py-2 border rounded" />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="inputMode" value="upload"
              checked={inputMode === 'upload'}
              onChange={() => setInputMode('upload')} /> Upload Image
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
            {form.image_url && <p className="text-xs text-green-600">✅ Uploaded</p>}
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

        <div className="flex gap-2">
          <button type="submit" className="btn-primary">
            {editingId ? 'Update Advertisement' : 'Add Advertisement'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ads.map((ad) => (
          <div key={ad.id} className="relative group overflow-hidden rounded-xl shadow">
            <img src={ad.image_url} alt={ad.title} className="h-32 w-full object-cover" />
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(ad)}
                className="bg-blue-500 text-white p-1 rounded-full text-xs hover:bg-blue-600"
                title="Edit"
              >
                ✎
              </button>
              <button
                onClick={() => handleDelete(ad.id)}
                className="bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600"
                title="Delete"
              >
                ✕
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
              <p className="text-white text-xs truncate">{ad.title || 'Advertisement'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}