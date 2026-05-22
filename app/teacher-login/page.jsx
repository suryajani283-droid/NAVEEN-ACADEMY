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

    // Step 1: Sign in with Supabase Auth
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (signInError) {
      setError(signInError.message)
      return
    }

    // Step 2: Check if the logged-in user exists in the teachers table
    const userId = data.user?.id
    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select('id')
      .eq('id', userId)          // ✅ अब सही यूज़र की जाँच करें
      .single()

    if (teacherError || !teacher) {
      setError('आप शिक्षक के रूप में पंजीकृत नहीं हैं।')
      await supabase.auth.signOut()   // लॉगआउट कर दें
      return
    }

    // Login successful – redirect to teacher dashboard
    router.push('/teacher/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 pt-20 pb-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">शिक्षक लॉगिन</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="ईमेल"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="पासवर्ड"
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
            लॉग इन करें
          </button>
        </form>
      </div>
    </div>
  )
}