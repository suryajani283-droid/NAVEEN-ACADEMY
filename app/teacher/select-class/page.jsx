'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function SelectClassPage() {
  const [assignments, setAssignments] = useState([])
  const [selected, setSelected] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchAssignments = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/teacher-login'); return }
      const { data } = await supabase
        .from('teacher_assignments')
        .select('class, subject')
        .eq('teacher_id', user.id)
      setAssignments(data || [])
    }
    fetchAssignments()
  }, [router])

  const handleContinue = () => {
    if (!selected) return
    const parts = selected.split('|')
    const cls = parts[0]
    const sub = parts[1] || ''
    router.push(`/teacher/dashboard?class=${encodeURIComponent(cls)}&subject=${encodeURIComponent(sub)}`)
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8 max-w-md">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Select Your Class</h2>
      <div className="card space-y-4">
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className="w-full px-4 py-2 border rounded">
          <option value="">-- Choose Class --</option>
          {assignments.map((a, idx) => (
            <option key={idx} value={`${a.class}|${a.subject || ''}`}>
              {a.class} {a.subject ? `- ${a.subject}` : ''}
            </option>
          ))}
        </select>
        <button onClick={handleContinue} disabled={!selected} className="btn-primary w-full">
          Continue to Dashboard
        </button>
      </div>
    </div>
  )
}