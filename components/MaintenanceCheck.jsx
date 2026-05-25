'use client'
import { useEffect } from 'react'

export default function MaintenanceCheck() {
  useEffect(() => {
    const syncCookie = async () => {
      try {
        const res = await fetch('/api/maintenance')
        if (res.ok) {
          const data = await res.json()
          // Sync cookie with Supabase value
          document.cookie = `maintenance_mode=${data.maintenance_mode}; path=/; max-age=86400; samesite=strict`
          
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
    syncCookie()
  }, [])

  return null
}