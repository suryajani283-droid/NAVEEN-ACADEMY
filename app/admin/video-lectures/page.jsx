'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AdminVideoLectures() {
  const [lectures, setLectures] = useState([])
  const [form, setForm] = useState({ subject: '', chapter: '', title: '', youtube_url: '', class: '' })

  const fetchLectures = async () => {
    const { data } = await supabase
      .from('video_lectures')
      .select('*')
      .order('created_at', { ascending: false })
    setLectures(data || [])
  }

  useEffect(() => { fetchLectures() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, class: form.class ? Number(form.class) : null }
    await fetch('/api/admin/video-lectures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    })
    setForm({ subject: '', chapter: '', title: '', youtube_url: '', class: '' })
    fetchLectures()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return
    await fetch(`/api/admin/video-lectures/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchLectures()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Manage Video Lectures</h2>
      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} className="w-full px-4 py-2 border rounded" required />
          <input placeholder="Chapter" value={form.chapter} onChange={(e) => setForm({...form, chapter: e.target.value})} className="w-full px-4 py-2 border rounded" required />
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full px-4 py-2 border rounded" required />
          <input placeholder="YouTube URL or Video ID" value={form.youtube_url} onChange={(e) => setForm({...form, youtube_url: e.target.value})} className="w-full px-4 py-2 border rounded" required />
          <input type="number" placeholder="Class (optional)" value={form.class} onChange={(e) => setForm({...form, class: e.target.value})} className="w-full px-4 py-2 border rounded" />
        </div>
        <button type="submit" className="btn-primary">Add Lecture</button>
      </form>
      <div className="space-y-4">
        {lectures.map((lec) => (
          <div key={lec.id} className="card flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{lec.subject} – {lec.chapter}: {lec.title}</h3>
              <p className="text-sm text-gray-500">Class {lec.class || 'All'}</p>
            </div>
            <button onClick={() => handleDelete(lec.id)} className="text-red-600 text-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}