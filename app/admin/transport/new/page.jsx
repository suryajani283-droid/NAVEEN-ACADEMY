'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamically import the map component (SSR off)
const RouteCreatorMap = dynamic(() => import('./RouteCreatorMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[60vh] bg-gray-100 flex items-center justify-center rounded-xl">
      Loading map...
    </div>
  )
})

export default function NewRoutePage() {
  const router = useRouter()
  const [routeNameEn, setRouteNameEn] = useState('')
  const [routeNameHi, setRouteNameHi] = useState('')
  const [routeColor, setRouteColor] = useState('#B4542C')
  const [stops, setStops] = useState([]) // each stop: { lat, lng, name_en, name_hi, stop_order }
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Called from the map when a new stop is added
  const handleAddStop = (stopData) => {
    setStops(prev => [...prev, stopData])
  }

  // Called from the map when a stop is removed (optional)
  const handleRemoveStop = (index) => {
    setStops(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!routeNameEn || !routeNameHi) {
      setMessage('Please fill route names in both languages.')
      return
    }
    if (stops.length < 2) {
      setMessage('Please add at least two stops on the map.')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      // 1. Create the route
      const routeRes = await fetch('/api/admin/transport/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name_en: routeNameEn,
          name_hi: routeNameHi,
          color: routeColor
        })
      })
      if (!routeRes.ok) throw new Error('Failed to create route')
      const route = await routeRes.json()

      // 2. Create all stops for that route
      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i]
        await fetch('/api/admin/transport/stops', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            route_id: route.id,
            name_en: stop.name_en,
            name_hi: stop.name_hi,
            lat: stop.lat,
            lng: stop.lng,
            stop_order: i + 1  // automatically assign order
          })
        })
      }

      router.push('/admin/transport')
    } catch (error) {
      setMessage('Error saving route: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold text-[#8B3A3A] mb-6">Create New Bus Route</h1>

      {/* Route Details Form */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 max-w-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            placeholder="Route Name (English)*"
            value={routeNameEn}
            onChange={e => setRouteNameEn(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Route Name (Hindi)*"
            value={routeNameHi}
            onChange={e => setRouteNameHi(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <div className="flex items-center gap-2">
            <label className="text-sm">Color:</label>
            <input
              type="color"
              value={routeColor}
              onChange={e => setRouteColor(e.target.value)}
              className="w-16 h-10 border rounded"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-2">
          👆 Click on the map below to add stops. After each click, fill the popup.
        </p>
      </div>

      {/* The interactive map */}
      <RouteCreatorMap
        stops={stops}
        onAddStop={handleAddStop}
        onRemoveStop={handleRemoveStop}
        routeColor={routeColor}
      />

      {/* Stops list & Save */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Stops ({stops.length})</h2>
        {stops.length === 0 ? (
          <p className="text-gray-500">No stops added yet. Click on the map.</p>
        ) : (
          <ul className="space-y-2 mb-4">
            {stops.map((stop, idx) => (
              <li key={idx} className="flex items-center justify-between border-b pb-2">
                <div>
                  <span className="font-medium">{idx + 1}.</span> {stop.name_en} ({stop.name_hi})
                  <span className="text-xs text-gray-400 ml-2">
                    Lat: {stop.lat.toFixed(4)}, Lng: {stop.lng.toFixed(4)}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveStop(idx)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {message && (
          <p className={`p-2 rounded mb-4 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
            {message}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#B4542C] hover:bg-[#8B3A3A] text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Route'}
          </button>
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:underline px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}