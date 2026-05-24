'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AdminVideoLectures() {
  const [lectures, setLectures] = useState([])
  const [form, setForm] = useState({
    subject: '',
    chapter: '',
    title: '',
    youtube_url: '',
    class: '',
  })
  const [teacherClass, setTeacherClass] = useState(null)

  // Detect if teacher is logged in
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

  const fetchLectures = async () => {
    let query = supabase
      .from('video_lectures')
      .select('*')
      .order('created_at', { ascending: false })

    // Teachers see only their class lectures + all-class lectures
    if (teacherClass) {
      query = query.or(`class.eq.${teacherClass},class.is.null`)
    }

    const { data } = await query
    setLectures(data || [])
  }

  useEffect(() => {
    fetchLectures()
  }, [teacherClass])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      class: teacherClass || (form.class ? Number(form.class) : null),
    }
    const res = await fetch('/api/admin/video-lectures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    })
    if (res.ok) {
      setForm({ subject: '', chapter: '', title: '', youtube_url: '', class: '' })
      fetchLectures()
    } else {
      const errData = await res.json().catch(() => ({ error: 'Unknown error' }))
      alert('Error: ' + (errData.error || res.statusText))
    }
  }

  const handleEdit = (lec) => {
    setForm({
      subject: lec.subject,
      chapter: lec.chapter,
      title: lec.title,
      youtube_url: lec.youtube_url,
      class: lec.class || '',
    })
    // Scroll to top for editing
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this lecture?')) return
    const res = await fetch(`/api/admin/video-lectures/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (res.ok) {
      fetchLectures()
    } else {
      const errData = await res.json().catch(() => ({ error: 'Unknown error' }))
      alert('Delete failed: ' + (errData.error || res.statusText))
    }
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">
        Manage Video Lectures
        {teacherClass && <span className="text-lg font-normal text-gray-500 ml-2">(Class {teacherClass})</span>}
      </h2>

      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text" placeholder="Subject *" value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full px-4 py-2 border rounded" required
          />
          <input
            type="text" placeholder="Chapter *" value={form.chapter}
            onChange={(e) => setForm({ ...form, chapter: e.target.value })}
            className="w-full px-4 py-2 border rounded" required
          />
          <input
            type="text" placeholder="Title *" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 border rounded" required
          />
          <input
            type="text" placeholder="YouTube URL or Video ID *" value={form.youtube_url}
            onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
            className="w-full px-4 py-2 border rounded" required
          />
          {/* Show class input only for admin (not teacher) */}
          {!teacherClass && (
            <input
              type="number" placeholder="Class (optional, leave empty for all)" value={form.class}
              onChange={(e) => setForm({ ...form, class: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />
          )}
        </div>
        <button type="submit" className="btn-primary">Add Lecture</button>
      </form>

      <div className="space-y-4">
        {lectures.map((lec) => (
          <div key={lec.id} className="card flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h3 className="font-semibold">
                {lec.subject} – {lec.chapter}: {lec.title}
              </h3>
              <p className="text-sm text-gray-500">
                Class: {lec.class || 'All'} | {lec.youtube_url}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(lec)} className="text-sm text-blue-600">Edit</button>
              <button onClick={() => handleDelete(lec.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}
        {lectures.length === 0 && (
          <p className="text-gray-500 text-center py-8">No video lectures added yet.</p>
        )}
      </div>
    </div>
  )
}