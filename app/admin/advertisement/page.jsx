'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AdminAdvertisement() {
  const [ads, setAds] = useState([])
  const [form, setForm] = useState({ image_url: '', title: '', link_url: '' })
  const [uploading, setUploading] = useState(false)
  const [inputMode, setInputMode] = useState('upload') // 'upload' or 'link'

  const fetchAds = async () => {
    const { data } = await supabase
      .from('advertisement')
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
    const res = await fetch('/api/admin/advertisement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include',
    })
    if (res.ok) {
      setForm({ image_url: '', title: '', link_url: '' })
      fetchAds()
    } else {
  const errData = await res.json().catch(() => ({ error: 'Unknown error' }));
  alert('Error adding ad: ' + (errData.error || res.statusText));
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this ad?')) return
    await fetch(`/api/admin/advertisement/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchAds()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Manage Advertisement</h2>

      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
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

        <button type="submit" className="btn-primary">Add Advertisement</button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ads.map((ad) => (
          <div key={ad.id} className="relative group overflow-hidden rounded-xl shadow">
            <img src={ad.image_url} alt={ad.title} className="h-32 w-full object-cover" />
            <button
              onClick={() => handleDelete(ad.id)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
            >
              ✕
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
              <p className="text-white text-xs truncate">{ad.title || 'Ad'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
      }
