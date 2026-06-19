'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function ManageStops() {
  const { routeId } = useParams()
  const router = useRouter()
  const [route, setRoute] = useState(null)
  const [stops, setStops] = useState([])
  const [form, setForm] = useState({ name_en: '', name_hi: '', lat: '', lng: '', stop_order: '' })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchRoute()
    fetchStops()
  }, [routeId])

  const fetchRoute = async () => {
    const { data } = await supabase.from('bus_routes').select('*').eq('id', routeId).single()
    setRoute(data)
  }

  const fetchStops = async () => {
    const { data } = await supabase.from('bus_stops').select('*').eq('route_id', routeId).order('stop_order')
    setStops(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const body = {
      route_id: Number(routeId),
      name_en: form.name_en,
      name_hi: form.name_hi,
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
      stop_order: parseInt(form.stop_order) || 0
    }
    if (editingId) {
      await fetch(`/api/admin/transport/stops/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      setMessage('Stop updated')
    } else {
      await fetch('/api/admin/transport/stops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      setMessage('Stop added')
    }
    setForm({ name_en: '', name_hi: '', lat: '', lng: '', stop_order: '' })
    setEditingId(null)
    fetchStops()
  }

  const handleEdit = (stop) => {
    setForm({
      name_en: stop.name_en,
      name_hi: stop.name_hi,
      lat: stop.lat.toString(),
      lng: stop.lng.toString(),
      stop_order: stop.stop_order.toString()
    })
    setEditingId(stop.id)
  }

  const handleDelete = async (id) => {
    await fetch(`/api/admin/transport/stops/${id}`, { method: 'DELETE' })
    fetchStops()
  }

  if (!route) return <div className="container mx-auto px-4 py-8 mt-16">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="text-gray-600 hover:underline">← Back</button>
        <h1 className="text-3xl font-bold text-[#8B3A3A]">Manage Stops: {route.name_en} ({route.name_hi})</h1>
      </div>
      {message && <p className="bg-green-100 text-green-700 p-2 rounded mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded-lg shadow space-y-3 max-w-xl">
        <input placeholder="Stop Name (English)" value={form.name_en} onChange={e => setForm({...form, name_en: e.target.value})} className="w-full border p-2 rounded" required />
        <input placeholder="Stop Name (Hindi)" value={form.name_hi} onChange={e => setForm({...form, name_hi: e.target.value})} className="w-full border p-2 rounded" required />
        <div className="flex gap-2">
          <input type="number" step="any" placeholder="Latitude" value={form.lat} onChange={e => setForm({...form, lat: e.target.value})} className="w-1/2 border p-2 rounded" required />
          <input type="number" step="any" placeholder="Longitude" value={form.lng} onChange={e => setForm({...form, lng: e.target.value})} className="w-1/2 border p-2 rounded" required />
        </div>
        <input type="number" placeholder="Stop Order (1,2,3...)" value={form.stop_order} onChange={e => setForm({...form, stop_order: e.target.value})} className="w-full border p-2 rounded" />
        <button type="submit" className="bg-[#B4542C] text-white px-4 py-2 rounded hover:bg-[#8B3A3A]">
          {editingId ? 'Update Stop' : 'Add Stop'}
        </button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name_en: '', name_hi: '', lat: '', lng: '', stop_order: '' }) }} className="ml-2 text-gray-600 underline">Cancel</button>}
      </form>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#8B3A3A] text-white">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Name (EN)</th>
              <th className="p-3 text-left">Name (HI)</th>
              <th className="p-3 text-left">Lat</th>
              <th className="p-3 text-left">Lng</th>
              <th className="p-3 text-left">Order</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stops.map((stop, idx) => (
              <tr key={stop.id} className="border-b">
                <td className="p-3">{idx+1}</td>
                <td className="p-3">{stop.name_en}</td>
                <td className="p-3">{stop.name_hi}</td>
                <td className="p-3">{stop.lat}</td>
                <td className="p-3">{stop.lng}</td>
                <td className="p-3">{stop.stop_order}</td>
                <td className="p-3 flex gap-2 justify-center">
                  <button onClick={() => handleEdit(stop)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(stop.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}