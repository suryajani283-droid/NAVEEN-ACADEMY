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
  const [teacherName, setTeacherName] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchTeacher = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/teacher-login')
        return
      }

      const { data: teacher, error } = await supabase
        .from('teachers')
        .select('class, name')
        .eq('id', user.id)        // ✅ सही यूज़र के लिए
        .single()

      if (error || !teacher) {
        router.push('/teacher-login')
        return
      }

      setTeacherClass(teacher.class)
      setTeacherName(teacher.name)
    }
    fetchTeacher()
  }, [router])

  if (!teacherClass) return <div className="pt-20 text-center">लोड हो रहा है...</div>

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-2">
        नमस्ते, {teacherName}
      </h2>
      <p className="text-gray-500 mb-8">कक्षा {teacherClass} का प्रबंधन</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/teacher/homework" className="card text-center hover:shadow-lg">
          <span className="text-4xl">📝</span>
          <h3 className="font-semibold mt-2">होमवर्क</h3>
        </Link>
        <Link href="/teacher/notes" className="card text-center hover:shadow-lg">
          <span className="text-4xl">📚</span>
          <h3 className="font-semibold mt-2">नोट्स</h3>
        </Link>
        <Link href="/teacher/results" className="card text-center hover:shadow-lg">
          <span className="text-4xl">🏆</span>
          <h3 className="font-semibold mt-2">रिजल्ट</h3>
        </Link>
        <Link href="/teacher/video-lectures" className="card text-center hover:shadow-lg">
          <span className="text-4xl">🎬</span>
          <h3 className="font-semibold mt-2">वीडियो लेक्चर</h3>
        </Link>
      </div>
    </div>
  )
}