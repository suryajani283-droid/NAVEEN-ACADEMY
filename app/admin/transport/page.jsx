'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AdminTransport() {
  const [routes, setRoutes] = useState([])
  const [form, setForm] = useState({ name_en: '', name_hi: '', color: '#B4542C' })
  const [message, setMessage] = useState('')

  useEffect(() => { fetchRoutes() }, [])

  const fetchRoutes = async () => {
    const { data } = await supabase.from('bus_routes').select('*').order('id')
    setRoutes(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/admin/transport/routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      setMessage('Route added')
      setForm({ name_en: '', name_hi: '', color: '#B4542C' })
      fetchRoutes()
    } else {
      setMessage('Error adding route')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this route and all its stops?')) return
    await fetch(`/api/admin/transport/routes/${id}`, { method: 'DELETE' })
    fetchRoutes()
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold text-[#8B3A3A] mb-6">Manage Bus Routes</h1>
      {message && <p className="bg-green-100 text-green-700 p-2 rounded mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded-lg shadow space-y-3 max-w-xl">
        <input placeholder="Route Name (English)" value={form.name_en} onChange={e => setForm({...form, name_en: e.target.value})} className="w-full border p-2 rounded" required />
        <input placeholder="Route Name (Hindi)" value={form.name_hi} onChange={e => setForm({...form, name_hi: e.target.value})} className="w-full border p-2 rounded" required />
        <div className="flex items-center gap-2">
          <label className="text-sm">Color:</label>
          <input type="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} className="w-16 h-10 border rounded" />
        </div>
        <button type="submit" className="bg-[#B4542C] text-white px-4 py-2 rounded hover:bg-[#8B3A3A]">Add Route</button>
      </form>

      <div className="grid gap-4">
        {routes.map(route => (
          <div key={route.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between" style={{ borderLeft: `4px solid ${route.color}` }}>
            <div>
              <Link href={`/admin/transport/${route.id}`} className="text-lg font-semibold text-gray-800 hover:text-[#B4542C]">
                {route.name_en}
              </Link>
              <p className="text-sm text-gray-500">{route.name_hi}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/transport/${route.id}`} className="text-blue-600 hover:underline text-sm">Manage Stops</Link>
              <button onClick={() => handleDelete(route.id)} className="text-red-600 hover:underline text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}