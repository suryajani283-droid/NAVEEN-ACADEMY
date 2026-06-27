'use client'
import { useState, useEffect } from 'react'

export default function TeacherAttendance() {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})   // { studentId: 'present'/'absent' }
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [message, setMessage] = useState('')
  const [absentCounts, setAbsentCounts] = useState({})  // { studentId: totalAbsences }
  const [saved, setSaved] = useState(false)   // true after saving attendance
  const [saving, setSaving] = useState(false)

  // Academic year start date (1 April)
  const ACADEMIC_START = '2025-04-01'

  // Fetch students and existing attendance when class/date change
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
        setSaved(false)
      }
    } catch (err) {
      setMessage('Error fetching students.')
    }
  }

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
    setSaved(false)
  }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
    setSaved(false)
  }

  const toggleStatus = (id) => {
    setAttendance(prev => ({
      ...prev,
      [id]: prev[id] === 'present' ? 'absent' : 'present'
    }))
    setSaved(false)   // need to re‑save after changes
  }

  // Bilingual message text (English + Hindi)
  const getMessageText = (student, totalAbsent) => {
    const today = new Date(selectedDate).toLocaleDateString('en-IN')
    return (
      `Dear Parent,\n\n` +
      `This is to inform you that ${student.student_name} (Class ${selectedClass}) was ABSENT today (${today}).\n` +
      `Total absences this academic year: ${totalAbsent}.\n\n` +
      `Please ensure regular attendance.\n\n` +
      `प्रिय अभिभावक,\n\n` +
      `सूचित किया जाता है कि ${student.student_name} (कक्षा ${selectedClass}) आज (${today}) अनुपस्थित रहा/रही।\n` +
      `इस शैक्षणिक वर्ष में कुल अनुपस्थिति: ${totalAbsent}।\n\n` +
      `कृपया नियमित उपस्थिति सुनिश्चित करें।\n\n` +
      `- Naveen Academy / नवीन अकादमी`
    )
  }

  // WhatsApp link
  const getWhatsAppLink = (student, totalAbsent) => {
    const msg = getMessageText(student, totalAbsent).replace(/\n/g, '%0A')
    return `https://wa.me/${student.parent_phone}?text=${msg}`
  }

  // SMS link
  const getSMSLink = (student, totalAbsent) => {
    const msg = getMessageText(student, totalAbsent)
    return `sms:${student.parent_phone}?body=${encodeURIComponent(msg)}`
  }

  const saveAttendance = async () => {
    setSaving(true)
    setMessage('')
    setSaved(false)

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

      // 1. Fetch all attendance for this class from the start of the academic year
      const fromDate = ACADEMIC_START
      const toDate = selectedDate   // up to today (inclusive)
      const resAll = await fetch(`/api/attendance?class=${selectedClass}&from=${fromDate}&to=${toDate}`)
      const allData = await resAll.json()

      // 2. Count absences per student
      const counts = {}
      if (Array.isArray(allData)) {
        allData.forEach(record => {
          if (record.status === 'absent') {
            const sid = record.student_id
            counts[sid] = (counts[sid] || 0) + 1
          }
        })
      }
      setAbsentCounts(counts)
      setSaved(true)   // show send buttons

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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStatus(s.id)}
                  className={`px-4 py-1 rounded ${attendance[s.id] === 'present' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                >
                  {attendance[s.id] === 'present' ? 'Present' : 'Absent'}
                </button>

                {/* Send buttons – only for absent, after save, and if phone exists */}
                {attendance[s.id] === 'absent' && saved && s.parent_phone && (
                  <>
                    <a
                      href={getWhatsAppLink(s, absentCounts[s.id] || 0)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
                      title="Send WhatsApp"
                    >
                      📤 WA
                    </a>
                    <a
                      href={getSMSLink(s, absentCounts[s.id] || 0)}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
                      title="Send SMS"
                    >
                      💬 SMS
                    </a>
                  </>
                )}
              </div>
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
    </div>
  )
}