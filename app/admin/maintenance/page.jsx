'use client'
import { useState, useEffect } from 'react'

export default function AdminMaintenance() {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch('/api/admin/maintenance', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setEnabled(data.maintenance_mode)
      }
      setLoading(false)
    }
    fetchStatus()
  }, [])

  const toggleMaintenance = async () => {
    const newState = !enabled
    const res = await fetch('/api/admin/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: newState }),
      credentials: 'include',
    })
    if (res.ok) {
      setEnabled(newState)
      alert(newState ? 'Maintenance mode ON' : 'Maintenance mode OFF')
    }
  }

  if (loading) return <div className="pt-20 text-center">Loading...</div>

  return (
    <div className="pt-20 container mx-auto px-4 py-8 text-center">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Maintenance Mode</h2>
      
      <div className="card max-w-md mx-auto">
        <p className="text-gray-600 mb-6">
          When enabled, all visitors (except admins) will see a "Under Maintenance" page.
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className={`text-lg font-semibold ${!enabled ? 'text-green-600' : 'text-gray-400'}`}>
            OFF
          </span>
          <button
            onClick={toggleMaintenance}
            className={`relative w-20 h-10 rounded-full transition-colors ${
              enabled ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            <div className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow transition-transform ${
              enabled ? 'translate-x-10' : 'translate-x-1'
            }`} />
          </button>
          <span className={`text-lg font-semibold ${enabled ? 'text-red-600' : 'text-gray-400'}`}>
            ON
          </span>
        </div>

        {enabled && (
          <p className="text-red-500 font-semibold animate-pulse">
            ⚠️ Website is currently under maintenance
          </p>
        )}
      </div>
    </div>
  )
}