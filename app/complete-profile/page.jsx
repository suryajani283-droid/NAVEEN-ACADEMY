'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function CompleteProfilePage() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    class: '',
    password: '',
  })
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/login')
    }
    checkSession()
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      setError('Session expired. Please login again.')
      router.push('/login')
      return
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: form.fullName,
        phone: form.phone,
        class: form.class,
      })

    if (profileError) {
      setError(profileError.message)
      return
    }

    if (form.password) {
      const { error: pwError } = await supabase.auth.updateUser({
        password: form.password,
      })
      if (pwError) {
        setError('Profile saved, but password not set: ' + pwError.message)
        return
      }
    }

    router.push('/student-corner')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 pt-20 pb-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Complete Your Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg" required />
          <input type="tel" placeholder="Phone Number (e.g., +919876543210)" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg" required />
          <input type="text" placeholder="Class (e.g., 10, XI Arts)" value={form.class}
            onChange={(e) => setForm({ ...form, class: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg" required />
          <input type="password" placeholder="Set a password (optional)" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors">
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  )
}