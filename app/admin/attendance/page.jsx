'use client'
import { useState, useEffect } from 'react'

export default function TeacherAttendance() {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})   // { studentId: 'present'/'absent' }
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [message, setMessage] = useState('')
  const [whatsappLinks, setWhatsappLinks] = useState([])
  const [absentCounts, setAbsentCounts] = useState({})
  const [saving, setSaving] = useState(false)

  // Fetch students when class changes, also fetch existing attendance for the date
  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass)
      fetchExistingAttendance(selectedClass, selectedDate)
    }
  }, [selectedClass, selectedDate])

  const fetchStudents = async (className) => {
    try {
      const res = await fetch(`/api/students?class=${className}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setStudents(data)
        const initial = {}
        data.forEach(s => initial[s.id] = 'present')
        setAttendance(initial)
      }
    } catch (err) {
      setMessage('Error fetching students.')
    }
  }

  // Fetch existing attendance for the selected date/class and pre-fill toggles
  const fetchExistingAttendance = async (className, date) => {
    try {
      const res = await fetch(`/api/attendance?class=${className}&date=${date}`)
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        const existing = {}
        data.forEach(record => {
          existing[record.student_id] = record.status
        })
        setAttendance(prev => ({ ...prev, ...existing }))
      }
    } catch (err) {
      console.error('Failed to fetch existing attendance', err)
    }
  }

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value)
    setWhatsappLinks([])
  }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
    setWhatsappLinks([])
  }

  const toggleStatus = (id) => {
    setAttendance(prev => ({
      ...prev,
      [id]: prev[id] === 'present' ? 'absent' : 'present'
    }))
  }

  const saveAttendance = async () => {
    setSaving(true)
    setMessage('')
    setWhatsappLinks([])

    const records = Object.entries(attendance).map(([studentId, status]) => ({
      student_id: Number(studentId),
      date: selectedDate,
      status
    }))

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records })
      })

      if (!res.ok) throw new Error('Save failed')
      setMessage('Attendance saved!')

      const counts = {}
      const absentStudents = students.filter(s => attendance[s.id] === 'absent')

      if (absentStudents.length === 0) {
        setMessage('Attendance saved! No absent students.')
        setSaving(false)
        return
      }

      for (const s of absentStudents) {
        try {
          const res2 = await fetch(`/api/attendance/stats?student_id=${s.id}`)
          const data = await res2.json()
          counts[s.id] = data.count || 0
        } catch (e) {
          counts[s.id] = 0
        }
      }
      setAbsentCounts(counts)

      const today = new Date(selectedDate).toLocaleDateString('en-IN')
      const links = absentStudents
        .filter(s => s.parent_phone)
        .map(s => {
          const totalAbsent = counts[s.id] || 0
          // 🆕 Bilingual message (English + Hindi)
          const msg =
            `Dear Parent,%0A%0A` +
            `This is to inform you that ${s.student_name} (Class ${selectedClass}) was ABSENT today (${today}).%0A` +
            `Total absences this academic year: ${totalAbsent}.%0A%0A` +
            `Please ensure regular attendance.%0A%0A` +
            `प्रिय अभिभावक,%0A%0A` +
            `सूचित किया जाता है कि ${s.student_name} (कक्षा ${selectedClass}) आज (${today}) अनुपस्थित रहा/रही।%0A` +
            `इस शैक्षणिक वर्ष में कुल अनुपस्थिति: ${totalAbsent}।%0A%0A` +
            `कृपया नियमित उपस्थिति सुनिश्चित करें।%0A%0A` +
            `- Naveen Academy / नवीन अकादमी`

          return {
            name: s.student_name,
            phone: s.parent_phone,
            link: `https://wa.me/${s.parent_phone}?text=${msg}`
          }
        })

      if (links.length === 0) {
        setMessage('Attendance saved! No WhatsApp links – missing parent phone numbers.')
      } else {
        setWhatsappLinks(links)
      }
    } catch (err) {
      setMessage('Error saving attendance.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold text-[#8B3A3A] mb-4">Daily Attendance</h1>

      <div className="flex gap-4 mb-6">
        <select value={selectedClass} onChange={handleClassChange} className="border p-2 rounded">
          <option value="">Select Class</option>
          {['1','2','3','4','5','6','7','8','9','10','11','12'].map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="border p-2 rounded"
        />
      </div>

      {students.length > 0 && (
        <div className="space-y-2">
          {students.map(s => (
            <div key={s.id} className="flex items-center justify-between bg-white p-3 rounded shadow">
              <span>{s.student_name} ({s.father_name})</span>
              <button
                onClick={() => toggleStatus(s.id)}
                className={`px-4 py-1 rounded ${attendance[s.id] === 'present' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
              >
                {attendance[s.id] === 'present' ? 'Present' : 'Absent'}
              </button>
            </div>
          ))}
          <button
            onClick={saveAttendance}
            disabled={saving}
            className="bg-[#B4542C] text-white px-6 py-2 rounded mt-4 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-green-700">{message}</p>}

      {whatsappLinks.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Send WhatsApp Messages (Absent Students)</h2>
          <ul className="space-y-2 mb-4">
            {whatsappLinks.map((item, idx) => (
              <li key={idx}>
                <a href={item.link} target="_blank" className="text-blue-600 underline">
                  Send to {item.name} ({item.phone})
                </a>
              </li>
            ))}
          </ul>

          <button
            onClick={() => {
              whatsappLinks.forEach((item, i) => {
                setTimeout(() => {
                  window.open(item.link, '_blank')
                }, i * 800)
              })
            }}
            className="bg-green-600 text-white px-6 py-2 rounded mr-2"
          >
            📤 Send All (One-by-One)
          </button>

          <button
            onClick={() => {
              const today = new Date(selectedDate).toLocaleDateString('en-IN')
              const text = students
                .filter(s => attendance[s.id] === 'absent')
                .map(s => {
                  const totalAbsent = absentCounts[s.id] || 0
                  return (
                    `Dear Parent,\n\n` +
                    `This is to inform you that ${s.student_name} (Class ${selectedClass}) was ABSENT today (${today}).\n` +
                    `Total absences this academic year: ${totalAbsent}.\n\n` +
                    `Please ensure regular attendance.\n\n` +
                    `प्रिय अभिभावक,\n\n` +
                    `सूचित किया जाता है कि ${s.student_name} (कक्षा ${selectedClass}) आज (${today}) अनुपस्थित रहा/रही।\n` +
                    `इस शैक्षणिक वर्ष में कुल अनुपस्थिति: ${totalAbsent}।\n\n` +
                    `कृपया नियमित उपस्थिति सुनिश्चित करें।\n\n` +
                    `- Naveen Academy / नवीन अकादमी`
                  )
                })
                .join('\n\n---\n\n')
              navigator.clipboard.writeText(text).then(() => alert('Messages copied! Paste in WhatsApp.')).catch(() => alert('Could not copy.'))
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            📋 Copy All Messages
          </button>
        </div>
      )}
    </div>
  )
}