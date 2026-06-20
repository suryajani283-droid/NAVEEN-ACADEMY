'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminTransport() {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchRoutes = async () => {
    const res = await fetch('/api/admin/transport/routes')
    const data = await res.json()
    if (Array.isArray(data)) setRoutes(data)
    setLoading(false)
  }

  useEffect(() => { fetchRoutes() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this route and all its stops?')) return
    await fetch(`/api/admin/transport/routes/${id}`, { method: 'DELETE' })
    fetchRoutes()
  }

  if (loading) return <div className="container mx-auto px-4 py-8 mt-16">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#8B3A3A]">Bus Routes</h1>
        <Link
          href="/admin/transport/new"
          className="bg-[#B4542C] hover:bg-[#8B3A3A] text-white px-4 py-2 rounded-lg shadow"
        >
          + Add New Route
        </Link>
      </div>

      {routes.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl mb-2">No routes added yet</p>
          <p>Click the button above to create your first bus route on the map.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {routes.map(route => (
            <div
              key={route.id}
              className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
              style={{ borderLeft: `4px solid ${route.color}` }}
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">{route.name_en}</p>
                <p className="text-sm text-gray-500">{route.name_hi}</p>
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
          ))}
        </div>
      )}
    </div>
  )
}