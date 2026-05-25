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

    // Update Supabase
    const res = await fetch('/api/admin/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: newState }),
      credentials: 'include',
    })

    if (res.ok) {
      setEnabled(newState)
      // Set cookie for middleware
      document.cookie = `maintenance_mode=${newState}; path=/; max-age=86400; samesite=strict`
      alert(newState ? '✅ Maintenance mode ON' : '✅ Maintenance mode OFF - Site is live now')
    }
  }

  if (loading) return <div className="pt-20 text-center">Loading...</div>

  return (
    <div className="pt-20 container mx-auto px-4 py-8 text-center">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Maintenance Mode</h2>
      
      <div className="card max-w-md mx-auto">
        <p className="text-gray-600 mb-6">
          When ON, all visitors see "Under Maintenance". Admins can still access everything.
        </p>
        
        <button
          onClick={toggleMaintenance}
          className={`px-8 py-4 rounded-full text-xl font-bold text-white transition-all ${
            enabled 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {enabled ? '🟢 Turn OFF (Site is Live)' : '🔴 Turn ON Maintenance'}
        </button>

        {enabled && (
          <p className="mt-4 text-red-500 font-semibold animate-pulse">
            ⚠️ Maintenance mode is ACTIVE - Visitors see maintenance page
          </p>
        )}
      </div>
    </div>
  )
}