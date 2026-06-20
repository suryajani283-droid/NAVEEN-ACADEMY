'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AddStudentPage() {
  const router = useRouter()
  const [routes, setRoutes] = useState([])
  const [selectedRoute, setSelectedRoute] = useState('')
  const [stops, setStops] = useState([])
  const [selectedStop, setSelectedStop] = useState('')
  const [form, setForm] = useState({
    student_name: '',
    father_name: '',
    class: '',
    mobile: '',
    address: ''
  })
  const [message, setMessage] = useState('')

  // Fetch all routes on load
  useEffect(() => {
    fetch('/api/admin/transport/routes')
      .then(res => res.json())
      .then(data => setRoutes(data || []))
  }, [])

  // Fetch stops when a route is selected
  useEffect(() => {
    if (selectedRoute) {
      fetch(`/api/admin/transport/stops?route_id=${selectedRoute}`)
        .then(res => res.json())
        .then(data => setStops(data || []))
      setSelectedStop('')
    }
  }, [selectedRoute])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedStop) {
      setMessage('Please select a stop')
      return
    }
    const res = await fetch('/api/admin/transport/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stop_id: Number(selectedStop),
        ...form
      })
    })
    if (res.ok) {
      setMessage('Student added successfully!')
      setForm({ student_name: '', father_name: '', class: '', mobile: '', address: '' })
      // Optionally go back to list
      setTimeout(() => router.push('/admin/transport/students'), 1500)
    } else {
      const err = await res.json()
      setMessage('Error: ' + (err.error || 'Unknown error'))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold text-[#8B3A3A] mb-6">Add Student to Bus Stop</h1>
      {message && <p className="mb-4 p-2 rounded bg-blue-100 text-blue-700">{message}</p>}

      <form onSubmit={handleSubmit} className="max-w-lg bg-white p-4 rounded-lg shadow space-y-3">
        {/* Route selector */}
        <select
          value={selectedRoute}
          onChange={e => setSelectedRoute(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Route</option>
          {routes.map(route => (
            <option key={route.id} value={route.id}>{route.name_en} ({route.name_hi})</option>
          ))}
        </select>

        {/* Stop selector (dependent) */}
        <select
          value={selectedStop}
          onChange={e => setSelectedStop(e.target.value)}
          className="w-full border p-2 rounded"
          required
          disabled={!selectedRoute}
        >
          <option value="">Select Stop</option>
          {stops.map(stop => (
            <option key={stop.id} value={stop.id}>{stop.name_en} ({stop.name_hi})</option>
          ))}
        </select>

        <input
          placeholder="Student Name *"
          value={form.student_name}
          onChange={e => setForm({ ...form, student_name: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          placeholder="Father's Name *"
          value={form.father_name}
          onChange={e => setForm({ ...form, father_name: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          placeholder="Class *"
          value={form.class}
          onChange={e => setForm({ ...form, class: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          placeholder="Mobile (optional)"
          value={form.mobile}
          onChange={e => setForm({ ...form, mobile: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder="Address (optional)"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-[#B4542C] hover:bg-[#8B3A3A] text-white px-4 py-2 rounded w-full"
        >
          Add Student
        </button>
      </form>
    </div>
  )
}