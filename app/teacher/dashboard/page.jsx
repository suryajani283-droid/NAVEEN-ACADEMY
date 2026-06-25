'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function TeacherDashboard() {
  const params = useSearchParams()
  const cls = params.get('class') || ''
  const sub = params.get('subject') || ''

  if (!cls) {
    return (
      <div className="pt-20 text-center">
        <p className="text-gray-500">No class selected. Please go to <a href="/teacher/select-class" className="text-primary-500 underline">class selection</a>.</p>
      </div>
    )
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-2">
        Class {cls}{sub ? ` – ${sub}` : ''}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Link href={`/teacher/homework?class=${encodeURIComponent(cls)}&subject=${encodeURIComponent(sub)}`} className="card text-center hover:shadow-lg">
          <span className="text-4xl">📝</span><h3 className="font-semibold mt-2">Homework</h3>
        </Link>
        <Link href={`/teacher/notes?class=${encodeURIComponent(cls)}&subject=${encodeURIComponent(sub)}`} className="card text-center hover:shadow-lg">
          <span className="text-4xl">📚</span><h3 className="font-semibold mt-2">Notes</h3>
        </Link>
        <Link href={`/teacher/results?class=${encodeURIComponent(cls)}&subject=${encodeURIComponent(sub)}`} className="card text-center hover:shadow-lg">
          <span className="text-4xl">🏆</span><h3 className="font-semibold mt-2">Results</h3>
        </Link>
        <Link href={`/teacher/video-lectures?class=${encodeURIComponent(cls)}&subject=${encodeURIComponent(sub)}`} className="card text-center hover:shadow-lg">
          <span className="text-4xl">🎬</span><h3 className="font-semibold mt-2">Video Lectures</h3>
        </Link>
        {/* 🆕 Attendance card */}
        <Link href={`/teacher/attendance?class=${encodeURIComponent(cls)}`} className="card text-center hover:shadow-lg">
          <span className="text-4xl">📋</span><h3 className="font-semibold mt-2">Attendance</h3>
        </Link>
      </div>
    </div>
  )
}