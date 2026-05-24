'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TeacherDashboard() {
  const router = useRouter()

  useEffect(() => {
    router.push('/teacher/select-class')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-slate-500">Redirecting to class selection...</p>
      </div>
    </div>
  )
}