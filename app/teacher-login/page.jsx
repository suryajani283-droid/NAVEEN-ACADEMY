'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function TeacherLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // 1. Supabase Auth से login
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (signInError) {
      setError(signInError.message)
      return
    }

    // 2. teachers table में check करें
    const userId = data.user?.id
    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select('id')
      .eq('id', userId)
      .single()

    if (teacherError || !teacher) {
      setError('You are not registered as a teacher.')
      await supabase.auth.signOut()
      return
    }

    // 3. सफलता दिखाएँ और हार्ड रीडायरेक्ट करें
    setSuccess(true)
    window.location.href = '/teacher/dashboard'   // ✅ hard redirect – हमेशा काम करेगा
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 pt-20 pb-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Teacher Login
        </h2>

        {!success ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl"
            >
              Log In
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-green-600 font-semibold">✅ Login successful!</p>
            <p className="text-gray-600">Redirecting to your dashboard...</p>
            <Link
              href="/teacher/dashboard"
              className="inline-block bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600"
            >
              Go to Dashboard (manual)
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}