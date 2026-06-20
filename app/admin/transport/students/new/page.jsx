'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AddStudentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const stopId = searchParams.get('stop_id')

  const [stops, setStops] = useState([])
  const [form, setForm] = useState({
    stop_id: stopId || '',
    student_name: '',
    father_name: '',
    class: '',
    mobile: '',
    address: ''
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Fetch all stops for dropdown (if stopId not provided)
    fetch('/api/admin/transport/stops')
      .then(res => res.json())
      .then(data => setStops(data || []))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/admin/transport/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      setMessage('Student added successfully')
      setForm({ stop_id: form.stop_id, student_name: '', father_name: '', class: '', mobile: '', address: '' })
      // Optionally redirect back
      setTimeout(() => router.back(), 1500)
    } else {
      setMessage('Error adding student')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold text-[#8B3A3A] mb-6">Add Student to Bus Stop</h1>
      {message && <p className="mb-4 p-2 rounded bg-green-100 text-green-700">{message}</p>}
      <form onSubmit={handleSubmit} className="max-w-lg bg-white p-4 rounded-lg shadow space-y-3">
        <select
          value={form.stop_id}
          onChange={e => setForm({ ...form, stop_id: e.target.value })}
          required
          className="w-full border p-2 rounded"
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
        <button type="submit" className="bg-[#B4542C] text-white px-4 py-2 rounded hover:bg-[#8B3A3A]">
          Add Student
        </button>
      </form>
    </div>
  )
}