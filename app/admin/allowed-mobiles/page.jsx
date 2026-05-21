'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AdminAllowedMobiles() {
  const [mobiles, setMobiles] = useState([])
  const [phone, setPhone] = useState('')

  const fetchMobiles = async () => {
    const { data } = await supabase
      .from('allowed_mobiles')
      .select('*')
      .order('created_at', { ascending: false })
    setMobiles(data || [])
  }

  useEffect(() => { fetchMobiles() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!phone) return
    const res = await fetch('/api/admin/allowed-mobiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
      credentials: 'include',
    })
    if (res.ok) {
      setPhone('')
      fetchMobiles()
    } else {
      const err = await res.json()
      alert('Error: ' + err.error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this mobile?')) return
    await fetch(`/api/admin/allowed-mobiles/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchMobiles()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Manage Allowed Mobiles</h2>
      <form onSubmit={handleAdd} className="card mb-8 flex gap-4">
        <input
          type="tel"
          placeholder="+919876543210 (with country code)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
          required
        />
        <button type="submit" className="btn-primary">Add</button>
      </form>
      <div className="space-y-2">
        {mobiles.map((m) => (
          <div key={m.id} className="card flex justify-between items-center">
            <span>{m.phone}</span>
            <button onClick={() => handleDelete(m.id)} className="text-red-600 text-sm">Remove</button>
          </div>
        ))}
        {mobiles.length === 0 && <p className="text-gray-500">No mobiles added yet.</p>}
      </div>
    </div>
  )
}