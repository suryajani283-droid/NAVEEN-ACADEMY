'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function TeacherDashboard() {
  const [teacherClass, setTeacherClass] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchTeacher = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/teacher-login'); return }
      const { data: teacher } = await supabase
        .from('teachers')
        .select('class, name')
        .eq('id', user.id)
        .single()
      if (!teacher) { router.push('/teacher-login'); return }
      setTeacherClass(teacher.class)
      setLoading(false)
    }
    fetchTeacher()
  }, [router])

  if (loading) return <div className="pt-20 text-center">Loading...</div>

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">
        Teacher Dashboard – Class {teacherClass}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href={`/admin/homework`} className="card text-center hover:shadow-lg">
          <span className="text-4xl">📝</span>
          <h3 className="font-semibold mt-2">Homework</h3>
        </Link>
        <Link href={`/admin/notes`} className="card text-center hover:shadow-lg">
          <span className="text-4xl">📚</span>
          <h3 className="font-semibold mt-2">Notes</h3>
        </Link>
        <Link href={`/admin/results`} className="card text-center hover:shadow-lg">
          <span className="text-4xl">🏆</span>
          <h3 className="font-semibold mt-2">Results</h3>
        </Link>
        <Link href={`/admin/video-lectures`} className="card text-center hover:shadow-lg">
          <span className="text-4xl">🎬</span>
          <h3 className="font-semibold mt-2">Video Lectures</h3>
        </Link>
      </div>
    </div>
  )
}