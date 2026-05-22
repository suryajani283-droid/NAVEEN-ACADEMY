'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function TeacherLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [debug, setDebug] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setDebug('')

    // 1. Sign in with Supabase
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (signInError) {
      setError('Sign in failed: ' + signInError.message)
      return
    }

    const userId = data.user?.id
    setDebug('User ID: ' + userId)

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

    setDebug(prev => prev + '\nTeacher class: ' + teacher.class)

    // 3. Get teacher JWT from admin login API
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: '',
        role: 'teacher',
        class: teacher.class,
        name: teacher.name,
        userId,
      }),
    })

    const raw = await res.text()
    setDebug(prev => prev + '\nAPI response status: ' + res.status + '\nRaw: ' + raw)

    if (!res.ok) {
      try {
        const errData = JSON.parse(raw)
        setError('API error: ' + (errData.error || raw))
      } catch {
        setError('API error (non‑JSON): ' + raw)
      }
      return
    }

    // 4. Redirect to admin dashboard
    window.location.href = '/admin/dashboard'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 pt-20 pb-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Teacher Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg" required />
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg" required />
          {error && <p className="text-red-500 text-sm whitespace-pre-wrap">{error}</p>}
          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl">
            Log In
          </button>
        </form>
        {debug && (
          <pre className="mt-4 text-xs text-gray-500 bg-gray-100 p-3 rounded whitespace-pre-wrap">
            {debug}
          </pre>
        )}
      </div>
    </div>
  )
}