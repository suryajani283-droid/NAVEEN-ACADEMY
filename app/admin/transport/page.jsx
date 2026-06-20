'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Distance helpers
function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

function getDistanceFromLatLngInKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = deg2rad(lat2 - lat1)
  const dLng = deg2rad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function calculateRouteDistance(routePoints) {
  if (!routePoints || routePoints.length < 2) return null
  let total = 0
  for (let i = 0; i < routePoints.length - 1; i++) {
    const [lat1, lng1] = routePoints[i]
    const [lat2, lng2] = routePoints[i + 1]
    total += getDistanceFromLatLngInKm(lat1, lng1, lat2, lng2)
  }
  return total
}

export default function AdminTransport() {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchRoutes = async () => {
    try {
      const res = await fetch('/api/admin/transport/routes')
      if (!res.ok) throw new Error('Server returned ' + res.status)
      const data = await res.json()
      if (Array.isArray(data)) {
        setRoutes(data)
      } else {
        setError('Unexpected data format')
      }
    } catch (err) {
      setError(err.message || 'Failed to load routes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRoutes() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this route and all its stops?')) return
    try {
      const res = await fetch(`/api/admin/transport/routes/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      fetchRoutes()
    } catch (err) {
      alert('Delete error: ' + err.message)
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-8 mt-16 text-center">Loading routes...</div>

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16 text-center">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <button onClick={fetchRoutes} className="bg-[#B4542C] text-white px-4 py-2 rounded">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#8B3A3A]">Bus Routes</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/transport/students"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
          >
            👨‍🎓 Students List
          </Link>
          <Link
            href="/admin/transport/students/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Student
          </Link>
          <a
            href="/api/admin/export"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow"
          >
            📥 Export Excel
          </a>
          <Link
            href="/admin/transport/new"
            className="bg-[#B4542C] hover:bg-[#8B3A3A] text-white px-4 py-2 rounded-lg shadow"
          >
            + Add New Route
          </Link>
        </div>
      </div>

      {routes.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl mb-2">No routes added yet</p>
          <p>Click the button above to create your first bus route on the map.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {routes.map(route => {
            const dist = calculateRouteDistance(route.route_points)
            return (
              <div
                key={route.id}
                className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
                style={{ borderLeft: `4px solid ${route.color}` }}
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">{route.name_en}</p>
                  <p className="text-sm text-gray-500">{route.name_hi}</p>
                  {dist !== null && (
                    <p className="text-sm font-medium text-[#B4542C] mt-1">📏 {dist.toFixed(1)} km</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/transport/${route.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Manage Stops
                  </Link>
                  <button
                    onClick={() => handleDelete(route.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}