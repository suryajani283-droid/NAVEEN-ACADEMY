'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([])

  const fetchFeedbacks = async () => {
    const { data } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })
    setFeedbacks(data || [])
  }

  useEffect(() => { fetchFeedbacks() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this feedback?')) return
    await fetch('/api/admin/feedback', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
      credentials: 'include',
    })
    fetchFeedbacks()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Feedback</h2>
      <div className="space-y-4">
        {feedbacks.map((fb) => (
          <div key={fb.id} className="card flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{fb.parent_name} (Child: {fb.child_name}, Class {fb.class})</h3>
              <p className="text-sm text-gray-600">{fb.category} – {fb.message}</p>
              <p className="text-xs text-gray-400">Rating: {'⭐'.repeat(fb.rating)}</p>
              <p className="text-xs text-gray-400">{new Date(fb.created_at).toLocaleString()}</p>
            </div>
            <button onClick={() => handleDelete(fb.id)} className="text-sm text-red-600">Delete</button>
          </div>
        ))}
        {feedbacks.length === 0 && <p className="text-gray-500">No feedback yet.</p>}
      </div>
    </div>
  )
        }
