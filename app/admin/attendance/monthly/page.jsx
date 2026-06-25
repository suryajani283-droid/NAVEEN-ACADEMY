'use client'
import { useState } from 'react'

export default function MonthlyAttendanceReport() {
  const [selectedClass, setSelectedClass] = useState('')
  const [month, setMonth] = useState(new Date().getMonth() + 1) // 1-12
  const [year, setYear] = useState(new Date().getFullYear())
  const [records, setRecords] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const daysInMonth = new Date(year, month, 0).getDate() // number of days in month

  const fetchMonthlyReport = async () => {
    if (!selectedClass) {
      setError('Please select a class.')
      return
    }
    setLoading(true)
    setError('')
    const from = `${year}-${String(month).padStart(2, '0')}-01`
    const to = `${year}-${String(month).padStart(2, '0')}-${daysInMonth}`

    try {
      const res = await fetch(`/api/attendance?class=${selectedClass}&from=${from}&to=${to}`)
      const data = await res.json()
      if (!Array.isArray(data)) throw new Error('Invalid data')

      // Get unique students (sorted)
      const uniqueStudents = {}
      data.forEach(rec => {
        if (!uniqueStudents[rec.student_id]) {
          uniqueStudents[rec.student_id] = {
            id: rec.student_id,
            name: rec.students?.student_name || '—',
            father: rec.students?.father_name || '—',
            phone: rec.students?.parent_phone || '—',
          }
        }
      })
      const sortedStudents = Object.values(uniqueStudents).sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      )
      setStudents(sortedStudents)
      setRecords(data)
    } catch (err) {
      setError('Error fetching report.')
    } finally {
      setLoading(false)
    }
  }

  // Build a map: { [studentId]: { [day]: 'P' | 'A' } }
  const getAttendanceMap = () => {
    const map = {}
    records.forEach(rec => {
      const day = new Date(rec.date).getDate()
      if (!map[rec.student_id]) map[rec.student_id] = {}
      map[rec.student_id][day] = rec.status === 'present' ? 'P' : 'A'
    })
    return map
  }

  const exportCSV = () => {
    const attendanceMap = getAttendanceMap()
    const header = ['Student Name', 'Father Name', 'Phone']
    for (let d = 1; d <= daysInMonth; d++) header.push(d.toString())
    const rows = students.map(s => {
      const row = [s.name, s.father, s.phone]
      for (let d = 1; d <= daysInMonth; d++) {
        const status = attendanceMap[s.id]?.[d] || '-'
        row.push(status)
      }
      return row.join(',')
    })
    const csv = [header.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance_${selectedClass}_${year}-${month}.csv`
    a.click()
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold text-[#8B3A3A] mb-6">Monthly Attendance Report</h1>

      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="border p-2 rounded">
          <option value="">Select Class</option>
          {['1','2','3','4','5','6','7','8','9','10','11','12'].map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>

        <select value={month} onChange={e => setMonth(Number(e.target.value))} className="border p-2 rounded">
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>

        <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="border p-2 rounded w-24" />

        <button onClick={fetchMonthlyReport} className="bg-[#B4542C] text-white px-4 py-2 rounded">
          Show Report
        </button>

        {students.length > 0 && (
          <button onClick={exportCSV} className="bg-green-600 text-white px-4 py-2 rounded">
            📥 Download CSV
          </button>
        )}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p>Loading...</p>}

      {students.length > 0 && (
        <div className="overflow-auto">
          <table className="min-w-max bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 sticky left-0 bg-gray-100 z-10">Student Name</th>
                <th className="p-2">Father</th>
                <th className="p-2">Phone</th>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <th key={i + 1} className="p-1 text-xs w-8">{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(s => {
                const attendanceMap = getAttendanceMap()
                return (
                  <tr key={s.id} className="border-b">
                    <td className="p-2 sticky left-0 bg-white font-medium">{s.name}</td>
                    <td className="p-2">{s.father}</td>
                    <td className="p-2">{s.phone}</td>
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1
                      const status = attendanceMap[s.id]?.[day]
                      return (
                        <td key={day} className={`p-1 text-center text-sm ${status === 'P' ? 'text-green-600 font-bold' : status === 'A' ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
                          {status || '-'}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}