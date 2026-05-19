'use client'
import { useState, useEffect } from 'react'

export default function AdminContacts() {
  const [queries, setQueries] = useState([])

  const fetchQueries = async () => {
    const res = await fetch('/api/admin/contacts', { credentials: 'include' })
    if (res.ok) setQueries(await res.json())
  }

  useEffect(() => { fetchQueries() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this query?')) return
    await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchQueries()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Contact Queries</h2>
      <div className="space-y-4">
        {queries.map((q) => (
          <div key={q.id} className="card flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{q.name} ({q.email || 'no email'})</h3>
              <p className="text-sm text-gray-600">{q.subject} – {q.message}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(q.created_at).toLocaleString()}</p>
            </div>
            <button onClick={() => handleDelete(q.id)} className="text-sm text-red-600">Delete</button>
          </div>
        ))}
        {queries.length === 0 && <p className="text-gray-500">No queries yet.</p>}
      </div>
    </div>
  )
}
