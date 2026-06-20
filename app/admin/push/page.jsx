'use client'
import { useState } from 'react'

export default function AdminPush() {
  const [form, setForm] = useState({ title: '', body: '', url: '/' })
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')

  const send = async (e) => {
    e.preventDefault()
    setSending(true)
    setMessage('')
    const res = await fetch('/api/push/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    const sent = data.results ? data.results.filter(r => r.status === 'sent').length : 0
    setMessage(`Sent to ${sent} devices`)
    setSending(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold text-[#8B3A3A] mb-6">Send Push Notification</h1>
      <form onSubmit={send} className="max-w-xl bg-white p-4 rounded-lg shadow space-y-3">
        <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border p-2 rounded" required />
        <textarea placeholder="Body" value={form.body} onChange={e => setForm({...form, body: e.target.value})} className="w-full border p-2 rounded" rows={3} required />
        <input placeholder="URL (optional)" value={form.url} onChange={e => setForm({...form, url: e.target.value})} className="w-full border p-2 rounded" />
        <button type="submit" disabled={sending} className="bg-[#B4542C] text-white px-6 py-2 rounded-lg disabled:opacity-50">
          {sending ? 'Sending...' : 'Send Notification'}
        </button>
      </form>
      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  )
}