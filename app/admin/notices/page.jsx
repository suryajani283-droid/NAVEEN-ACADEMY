'use client'
import { useState, useEffect } from 'react'

export default function AdminNotices() {
  const [notices, setNotices] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Academic',
    type: 'Notice',
  })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchNotices = async () => {
    const res = await fetch('/api/admin/notices', { credentials: 'include' })
    if (res.ok) setNotices(await res.json())
  }

  useEffect(() => {
    fetchNotices()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const url = editingId
      ? `/api/admin/notices/${editingId}`
      : '/api/admin/notices'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include',
    })
    if (res.ok) {
      setForm({ title: '', description: '', category: 'Academic', type: 'Notice' })
      setEditingId(null)
      fetchNotices()
    }
    setLoading(false)
  }

  const handleEdit = (notice) => {
    setForm({
      title: notice.title,
      description: notice.description || '',
      category: notice.category,
      type: notice.type,
    })
    setEditingId(notice.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this notice?')) return
    await fetch(`/api/admin/notices/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    fetchNotices()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Manage Notices</h2>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
        <input
          type="text"
          placeholder="Notice Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          rows="3"
        />
        <div className="flex flex-wrap gap-4">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          >
            <option>Academic</option>
            <option>Events</option>
            <option>Exams</option>
            <option>Holidays</option>
            <option>Results</option>
          </select>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          >
            <option>Notice</option>
            <option>Important</option>
            <option>Urgent</option>
            <option>Event</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {editingId ? 'Update Notice' : 'Add Notice'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null)
              setForm({ title: '', description: '', category: 'Academic', type: 'Notice' })
            }}
            className="btn-secondary"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map((notice) => (
          <div key={notice.id} className="card flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{notice.title}</h3>
              <p className="text-sm text-gray-600">
                {notice.description?.substring(0, 150)}
              </p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {notice.category}
                </span>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                  {notice.type}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(notice)} className="text-sm text-blue-600">
                Edit
              </button>
              <button onClick={() => handleDelete(notice.id)} className="text-sm text-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
      }
