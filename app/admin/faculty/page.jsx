'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const departments = ['Science', 'Mathematics', 'Languages', 'Arts', 'Sports', 'Computer', 'Other']

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState([])
  const [form, setForm] = useState({
    name: '',
    qualification: '',
    subject: '',
    experience: '',
    department: 'Science',
    image_url: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [inputMode, setInputMode] = useState('upload')

  const fetchFaculty = async () => {
    const { data } = await supabase
      .from('faculty')
      .select('*')
      .order('created_at', { ascending: false })
    setFaculty(data || [])
  }

  useEffect(() => { fetchFaculty() }, [])

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) {
      alert('File size must be less than 3MB')
      return
    }
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: fd,
        credentials: 'include',
      })
      const data = await res.json()
      if (res.ok) setForm({ ...form, image_url: data.url })
      else alert('Upload failed: ' + data.error)
    } catch (err) {
      alert('Upload error')
    }
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = editingId ? `/api/admin/faculty/${editingId}` : '/api/admin/faculty'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        experience: Number(form.experience) || 0,
      }),
      credentials: 'include',
    })
    if (res.ok) {
      setForm({ name: '', qualification: '', subject: '', experience: '', department: 'Science', image_url: '' })
      setEditingId(null)
      setInputMode('upload')
      fetchFaculty()
    } else {
      const err = await res.json()
      alert('Error: ' + err.error)
    }
  }

  const handleEdit = (member) => {
    setForm({
      name: member.name,
      qualification: member.qualification || '',
      subject: member.subject || '',
      experience: member.experience || '',
      department: member.department || 'Science',
      image_url: member.image_url || '',
    })
    setEditingId(member.id)
    setInputMode('link')
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this faculty member?')) return
    await fetch(`/api/admin/faculty/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchFaculty()
  }

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Manage Faculty</h2>

      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Name *" value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            className="w-full px-4 py-2 border rounded" required />
          <input type="text" placeholder="Qualification" value={form.qualification}
            onChange={(e) => setForm({...form, qualification: e.target.value})}
            className="w-full px-4 py-2 border rounded" />
          <input type="text" placeholder="Subject" value={form.subject}
            onChange={(e) => setForm({...form, subject: e.target.value})}
            className="w-full px-4 py-2 border rounded" />
          <input type="number" placeholder="Experience (years)" value={form.experience}
            onChange={(e) => setForm({...form, experience: e.target.value})}
            className="w-full px-4 py-2 border rounded" />
          <select value={form.department}
            onChange={(e) => setForm({...form, department: e.target.value})}
            className="w-full px-4 py-2 border rounded">
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Image upload / link toggle */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="inputMode" value="upload"
              checked={inputMode === 'upload'}
              onChange={() => setInputMode('upload')} /> Upload Photo
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="inputMode" value="link"
              checked={inputMode === 'link'}
              onChange={() => setInputMode('link')} /> Paste Link
          </label>
        </div>

        {inputMode === 'upload' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Choose Image (max 3MB)</label>
            <input type="file" accept="image/*" onChange={handleFileUpload}
              className="w-full px-4 py-2 border rounded" />
            {uploading && <span className="text-sm text-primary-500">Uploading...</span>}
            {form.image_url && <p className="text-xs text-green-600">✅ Uploaded</p>}
          </div>
        )}

        {inputMode === 'link' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paste Image URL</label>
            <input type="url" placeholder="https://..."
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="w-full px-4 py-2 border rounded" />
          </div>
        )}

        <button type="submit" className="btn-primary">
          {editingId ? 'Update' : 'Add'} Faculty
        </button>
        {editingId && <button type="button" onClick={() => {
          setEditingId(null); setForm({ name: '', qualification: '', subject: '', experience: '', department: 'Science', image_url: '' }); setInputMode('upload')
        }} className="btn-secondary ml-2">Cancel</button>}
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        {faculty.map((member) => (
          <div key={member.id} className="card flex justify-between items-start">
            <div className="flex items-center gap-4">
              <img
                src={member.image_url || '/images/placeholder.jpg'}
                alt={member.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.subject} | {member.department}</p>
                <p className="text-xs text-gray-400">{member.qualification} | {member.experience} yrs</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(member)} className="text-sm text-blue-600">Edit</button>
              <button onClick={() => handleDelete(member.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
        }
