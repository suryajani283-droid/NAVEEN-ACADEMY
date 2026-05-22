'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function TeacherLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    // 1. Sign in with Supabase
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      return
    }

    const userId = data.user?.id

    // 2. Verify teacher record
    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select('class, name')
      .eq('id', userId)
      .single()

    if (teacherError || !teacher) {
      setError('You are not registered as a teacher.')
      await supabase.auth.signOut()
      return
    }

    // 3. Create a teacher JWT and set it as adminToken cookie
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: '',   // not needed for teacher login; we'll override in the API
        role: 'teacher',
        class: teacher.class,
        name: teacher.name,
        userId,         // pass Supabase user id to bypass password check
      }),
    })

    if (!res.ok) {
      setError('Failed to generate teacher token.')
      return
    }

    // 4. Redirect to admin dashboard
    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 pt-20 pb-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Teacher Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl">Log In</button>
        </form>
      </div>
    </div>
  )
}