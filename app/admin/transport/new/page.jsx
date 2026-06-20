'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const RouteCreatorMap = dynamic(() => import('./RouteCreatorMap'), {
  ssr: false,
  loading: () => <div className="h-[60vh] bg-gray-100 flex items-center justify-center rounded-xl">Loading map...</div>
})

export default function NewRoutePage() {
  const router = useRouter()
  const [routeNameEn, setRouteNameEn] = useState('')
  const [routeNameHi, setRouteNameHi] = useState('')
  const [routeColor, setRouteColor] = useState('#B4542C')
  const [routePoints, setRoutePoints] = useState([]) // { lat, lng }
  const [stops, setStops] = useState([]) // { lat, lng, name_en, name_hi }
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Route point handlers
  const addRoutePoint = (point) => setRoutePoints(prev => [...prev, point])
  const removeRoutePoint = (index) => setRoutePoints(prev => prev.filter((_, i) => i !== index))

  // Stop handlers
  const addStop = (stop) => setStops(prev => [...prev, stop])
  const removeStop = (index) => setStops(prev => prev.filter((_, i) => i !== index))

  const handleSave = async () => {
    if (!routeNameEn || !routeNameHi) { setMessage('Please fill route names'); return }
    if (routePoints.length < 2) { setMessage('Please draw the road path (min 2 points)'); return }
    if (stops.length < 2) { setMessage('Please add at least two bus stops'); return }

    setSaving(true)
    setMessage('')
    try {
      // Save route with route_points
      const routeRes = await fetch('/api/admin/transport/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name_en: routeNameEn,
          name_hi: routeNameHi,
          color: routeColor,
          route_points: routePoints.map(p => [p.lat, p.lng])
        })
      })
      if (!routeRes.ok) throw new Error('Failed to create route')
      const route = await routeRes.json()

      // Save stops
      for (const stop of stops) {
        await fetch('/api/admin/transport/stops', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            route_id: route.id,
            name_en: stop.name_en,
            name_hi: stop.name_hi,
            lat: stop.lat,
            lng: stop.lng,
            stop_order: 0 // you can improve ordering
          })
        })
      }

      router.push('/admin/transport')
    } catch (err) {
      setMessage('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold text-[#8B3A3A] mb-6">Create New Bus Route</h1>

      {/* Route details */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 max-w-xl">
        <input placeholder="Route Name (English)*" value={routeNameEn} onChange={e => setRouteNameEn(e.target.value)} className="border p-2 rounded w-full mb-2" required />
        <input placeholder="Route Name (Hindi)*" value={routeNameHi} onChange={e => setRouteNameHi(e.target.value)} className="border p-2 rounded w-full mb-2" required />
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm">Color:</label>
          <input type="color" value={routeColor} onChange={e => setRouteColor(e.target.value)} className="w-16 h-10 border rounded" />
        </div>
        <p className="text-sm text-gray-500">🔵 Blue points = road path. 🟢 Green points = bus stops.</p>
      </div>

      {/* Map */}
      <RouteCreatorMap
        routePoints={routePoints}
        onAddRoutePoint={addRoutePoint}
        onRemoveRoutePoint={removeRoutePoint}
        stops={stops}
        onAddStop={addStop}
        onRemoveStop={removeStop}
        routeColor={routeColor}
      />

      {/* Summary & Save */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow">
        <p>Road Points: {routePoints.length} | Stops: {stops.length}</p>
        {message && <p className="text-red-600">{message}</p>}
        <div className="flex gap-3 mt-3">
          <button onClick={handleSave} disabled={saving} className="bg-[#B4542C] hover:bg-[#8B3A3A] text-white px-6 py-2 rounded-lg disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Route'}
          </button>
          <button onClick={() => router.back()} className="text-gray-600 hover:underline px-4 py-2">Cancel</button>
        </div>
      </div>
    </div>
  )
}