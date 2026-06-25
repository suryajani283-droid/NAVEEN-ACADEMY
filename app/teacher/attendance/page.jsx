'use client'
import { useState, useEffect } from 'react'

export default function TeacherAttendance() {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})   // { studentId: 'present'/'absent' }
  const [selectedClass, setSelectedClass] = useState('')
  const [message, setMessage] = useState('')
  const [whatsappLinks, setWhatsappLinks] = useState([])
  const [absentCounts, setAbsentCounts] = useState({})

  const fetchStudents = async (className) => {
    const res = await fetch(`/api/students?class=${className}`)
    const data = await res.json()
    if (Array.isArray(data)) {
      setStudents(data)
      // Default all to present
      const initial = {}
      data.forEach(s => initial[s.id] = 'present')
      setAttendance(initial)
    }
  }

  const handleClassChange = (e) => {
    const cls = e.target.value
    setSelectedClass(cls)
    fetchStudents(cls)
  }

  const toggleStatus = (id) => {
    setAttendance(prev => ({
      ...prev,
      [id]: prev[id] === 'present' ? 'absent' : 'present'
    }))
  }

  const saveAttendance = async () => {
    const records = Object.entries(attendance).map(([studentId, status]) => ({
      student_id: Number(studentId),
      date: new Date().toISOString().split('T')[0],
      status
    }))
    const res = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ records })
    })
    if (res.ok) {
      setMessage('Attendance saved!')
      // Fetch old absent counts for absent students
      const counts = {}
      for (const [studentId, status] of Object.entries(attendance)) {
        if (status === 'absent') {
          const res2 = await fetch(`/api/attendance/stats?student_id=${studentId}`)
          const data = await res2.json()
          counts[studentId] = data.count || 0
        }
      }
      setAbsentCounts(counts)
      // Generate WhatsApp links
      generateLinks(counts)
    } else {
      setMessage('Error saving attendance.')
    }
  }

  const generateLinks = (counts) => {
    const today = new Date().toLocaleDateString('en-IN')
    const links = students
      .filter(s => attendance[s.id] === 'absent')
      .map(s => {
        const totalAbsent = counts[s.id] || 0
        const msg = `Dear Parent,%0A%0AThis is to inform you that ${s.student_name} (Class ${selectedClass}) was ABSENT today (${today}).%0ATotal absences this academic year: ${totalAbsent}.%0A%0APlease ensure regular attendance.%0A%0A- Naveen Academy`
        return {
          name: s.student_name,
          phone: s.parent_phone,
          link: `https://wa.me/${s.parent_phone}?text=${msg}`
        }
      })
    setWhatsappLinks(links)
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold text-[#8B3A3A] mb-4">Daily Attendance</h1>

      <select
        value={selectedClass}
        onChange={handleClassChange}
        className="border p-2 rounded mb-6"
      >
        <option value="">Select Class</option>
        {['1','2','3','4','5','6','7','8','9','10','11','12'].map(cls => (
          <option key={cls} value={cls}>{cls}</option>
        ))}
      </select>

      {students.length > 0 && (
        <div className="space-y-2">
          {students.map(s => (
            <div key={s.id} className="flex items-center justify-between bg-white p-3 rounded shadow">
              <span>{s.student_name} ({s.father_name})</span>
              <button
                onClick={() => toggleStatus(s.id)}
                className={`px-4 py-1 rounded ${
                  attendance[s.id] === 'present'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {attendance[s.id] === 'present' ? 'Present' : 'Absent'}
              </button>
            </div>
          ))}
          <button
            onClick={saveAttendance}
            className="bg-[#B4542C] text-white px-6 py-2 rounded mt-4"
          >
            Save Attendance
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-green-700">{message}</p>}

      {whatsappLinks.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Send WhatsApp Messages (Absent Students)</h2>
          <ul className="space-y-2">
            {whatsappLinks.map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.link}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Send to {item.name} ({item.phone})
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}