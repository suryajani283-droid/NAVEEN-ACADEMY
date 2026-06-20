'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function StudentsDashboard() {
  const [routes, setRoutes] = useState([])
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [stops, setStops] = useState([])
  const [studentsByStop, setStudentsByStop] = useState({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Fetch all routes
  useEffect(() => {
    fetch('/api/admin/transport/routes')
      .then(res => res.json())
      .then(data => setRoutes(data || []))
  }, [])

  const fetchStudentsForRoute = async (routeId) => {
    setLoading(true)
    // Fetch stops for this route
    const stopsRes = await fetch(`/api/admin/transport/stops?route_id=${routeId}`)
    const stopsData = await stopsRes.json()
    setStops(stopsData)

    // Fetch all students for these stops
    const studentMap = {}
    for (const stop of stopsData) {
      const studentsRes = await fetch(`/api/admin/transport/students?stop_id=${stop.id}`)
      const studentsData = await studentsRes.json()
      if (studentsData && Array.isArray(studentsData)) {
        studentMap[stop.id] = studentsData
      }
    }
    setStudentsByStop(studentMap)
    setSelectedRoute(routeId)
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold text-[#8B3A3A] mb-6">Students per Route</h1>

      {routes.length === 0 ? (
        <p>No routes added yet.</p>
      ) : (
        <div className="grid gap-4 mb-8">
          {routes.map(route => (
            <div
              key={route.id}
              className={`p-4 rounded-lg shadow cursor-pointer border-l-4 ${selectedRoute === route.id ? 'bg-blue-50' : 'bg-white'}`}
              style={{ borderColor: route.color }}
              onClick={() => fetchStudentsForRoute(route.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-lg">{route.name_en}</span>
                  <span className="text-sm text-gray-500 ml-2">({route.name_hi})</span>
                </div>
                <span className="text-sm text-gray-500">Click to view students</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRoute && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            {routes.find(r => r.id === selectedRoute)?.name_en} - Students
          </h2>
          {loading ? (
            <p>Loading students...</p>
          ) : (
            stops.map(stop => (
              <div key={stop.id} className="mb-6">
                <h3 className="text-xl font-medium text-[#B4542C] mb-2">
                  {stop.name_en} ({stop.name_hi})
                </h3>
                {studentsByStop[stop.id]?.length > 0 ? (
                  <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Father's Name</th>
                        <th className="p-2 text-left">Class</th>
                        <th className="p-2 text-left">Mobile</th>
                        <th className="p-2 text-left">Address</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsByStop[stop.id].map(student => (
                        <tr key={student.id} className="border-b">
                          <td className="p-2">{student.student_name}</td>
                          <td className="p-2">{student.father_name}</td>
                          <td className="p-2">{student.class}</td>
                          <td className="p-2">{student.mobile || '-'}</td>
                          <td className="p-2">{student.address || '-'}</td>
                          <td className="p-2">
                            <button
                              onClick={() => router.push(`/admin/transport/students/edit/${student.id}`)}
                              className="text-blue-600 hover:underline mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm('Delete student?')) {
                                  await fetch(`/api/admin/transport/students/${student.id}`, { method: 'DELETE' })
                                  fetchStudentsForRoute(selectedRoute)
                                }
                              }}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">No students assigned to this stop.</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}