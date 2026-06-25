'use client'
import { useState } from 'react'

export default function AdminAttendanceReport() {
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchReport = async () => {
    if (!selectedClass) {
      setError('Please select a class.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/attendance?class=${selectedClass}&date=${selectedDate}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        // Sort alphabetically by student_name
        const sortedData = [...data].sort((a, b) => {
          const nameA = (a.students?.student_name || '').toLowerCase();
          const nameB = (b.students?.student_name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });
        setRecords(sortedData);
      } else {
        setError('No data found.')
      }
    } catch (err) {
      setError('Error fetching attendance.')
    } finally {
      setLoading(false)
    }
  }

  const absentCount = records.filter(r => r.status === 'absent').length
  const presentCount = records.filter(r => r.status === 'present').length

  // 📥 Export Daily Report as CSV
  const exportDailyCSV = () => {
    const header = ['S.No.', 'Student Name', 'Father Name', 'Status', 'Parent Phone']
    const rows = records.map((rec, idx) => [
      idx + 1,
      rec.students?.student_name || '—',
      rec.students?.father_name || '—',
      rec.status,
      rec.students?.parent_phone || '—'
    ])
    const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance_${selectedClass}_${selectedDate}.csv`
    a.click()
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold text-[#8B3A3A] mb-6">Attendance Report</h1>

      <div className="flex gap-4 mb-6">
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="border p-2 rounded">
          <option value="">Select Class</option>
          {['1','2','3','4','5','6','7','8','9','10','11','12'].map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={fetchReport}
          className="bg-[#B4542C] text-white px-4 py-2 rounded"
        >
          Show Report
        </button>

        {records.length > 0 && (
          <button onClick={exportDailyCSV} className="bg-green-600 text-white px-4 py-2 rounded">
            📥 Download CSV
          </button>
        )}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading && <p>Loading...</p>}

      {records.length > 0 && (
        <>
          <div className="mb-4 flex gap-4">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded">Present: {presentCount}</div>
            <div className="bg-red-100 text-red-800 px-4 py-2 rounded">Absent: {absentCount}</div>
          </div>

          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-center w-16">S.No.</th>
                <th className="p-2 text-left">Student Name</th>
                <th className="p-2 text-left">Father Name</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Parent Phone</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, idx) => (
                <tr key={rec.id} className="border-b">
                  <td className="p-2 text-center">{idx + 1}</td>
                  <td className="p-2">{rec.students?.student_name || '—'}</td>
                  <td className="p-2">{rec.students?.father_name || '—'}</td>
                  <td className={`p-2 font-medium ${rec.status === 'present' ? 'text-green-600' : 'text-red-600'}`}>
                    {rec.status}
                  </td>
                  <td className="p-2">{rec.students?.parent_phone || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}