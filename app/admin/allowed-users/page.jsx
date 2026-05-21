'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AdminAllowedUsers() {
  const [users, setUsers] = useState([])
  const [email, setEmail] = useState('')

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('allowed_users')
      .select('*')
      .order('created_at', { ascending: false })
    setUsers(data || [])
  }

  useEffect(() => { fetchUsers() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!email) return
    const res = await fetch('/api/admin/allowed-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      credentials: 'include',
    })
    if (res.ok) {
      setEmail('')
      fetchUsers()
    } else {
      const err = await res.json()
      alert('Error: ' + err.error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this user?')) return
    await fetch(`/api/admin/allowed-users/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchUsers()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Manage Allowed Emails</h2>
      <form onSubmit={handleAdd} className="card mb-8 flex gap-4">
        <input
          type="email"
          placeholder="Enter email to allow"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
          required
        />
        <button type="submit" className="btn-primary">Add</button>
      </form>
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="card flex justify-between items-center">
            <span>{u.email}</span>
            <button onClick={() => handleDelete(u.id)} className="text-red-600 text-sm">Remove</button>
          </div>
        ))}
        {users.length === 0 && <p className="text-gray-500">No users added yet.</p>}
      </div>
    </div>
  )
}