'use client'
import { useEffect } from 'react'

export default function MaintenanceCheck() {
  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const res = await fetch('/api/maintenance')
        if (res.ok) {
          const data = await res.json()
          if (
            data.maintenance_mode &&
            !window.location.pathname.startsWith('/admin') &&
            !window.location.pathname.startsWith('/api') &&
            window.location.pathname !== '/maintenance'
          ) {
            window.location.href = '/maintenance'
          }
        }
      } catch {}
    }
    checkMaintenance()
  }, [])

  return null
}