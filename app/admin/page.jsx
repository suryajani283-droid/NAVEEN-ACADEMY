'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) router.push('/admin/dashboard')
    else setError('Wrong password')
  }

  return (
    <div className="pt-20 flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleLogin} className="card w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary-500 mb-6">Admin Login</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 border rounded-lg mb-4"
          required
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button type="submit" className="btn-primary w-full py-3">Login</button>
      </form>
    </div>
  )
        }
