'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function TeacherVideoLectures() {
  const [teacherClass, setTeacherClass] = useState(null)
  const [lectures, setLectures] = useState([])
  const [form, setForm] = useState({ subject: '', chapter: '', title: '', youtube_url: '' })
  const router = useRouter()

  useEffect(() => {
    const fetchTeacher = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/teacher-login'); return }
      const { data: teacher } = await supabase
        .from('teachers')
        .select('class')
        .eq('id', user.id)
        .single()
      if (!teacher) { router.push('/teacher-login'); return }
      setTeacherClass(teacher.class)
    }
    fetchTeacher()
  }, [router])

  const fetchLectures = async () => {
    if (!teacherClass) return
    const { data } = await supabase
      .from('video_lectures')
      .select('*')
      .or(`class.eq.${teacherClass},class.is.null`)
      .order('created_at')
    setLectures(data || [])
  }

  useEffect(() => { if (teacherClass) fetchLectures() }, [teacherClass])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, class: teacherClass }
    await fetch('/api/admin/video-lectures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    })
    setForm({ subject: '', chapter: '', title: '', youtube_url: '' })
    fetchLectures()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return
    await fetch(`/api/admin/video-lectures/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchLectures()
  }

  if (!teacherClass) return <div className="pt-20 text-center">Loading...</div>

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-2">Video Lectures for Class {teacherClass}</h2>
      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Subject" value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full px-4 py-2 border rounded" required />
          <input type="text" placeholder="Chapter" value={form.chapter}
            onChange={(e) => setForm({ ...form, chapter: e.target.value })}
            className="w-full px-4 py-2 border rounded" required />
          <input type="text" placeholder="Title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 border rounded" required />
          <input type="text" placeholder="YouTube URL or ID" value={form.youtube_url}
            onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
            className="w-full px-4 py-2 border rounded" required />
        </div>
        <button type="submit" className="btn-primary">Add Lecture</button>
      </form>
      <div className="space-y-4">
        {lectures.map((lec) => (
          <div key={lec.id} className="card flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{lec.subject} – {lec.chapter}: {lec.title}</h3>
              <p className="text-sm text-gray-500">{lec.youtube_url}</p>
            </div>
            <button onClick={() => handleDelete(lec.id)} className="text-red-600">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}