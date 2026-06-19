'use client'

import { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icon for existing stops (blue)
const existingIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Custom icon for the "new stop" preview (green)
const newStopIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Component to handle map click events
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng)
    },
  })
  return null
}

export default function StopsMap({ existingStops, onAddStop }) {
  const [clickedPos, setClickedPos] = useState(null)
  const [form, setForm] = useState({ name_en: '', name_hi: '', stop_order: '' })
  const [popupOpen, setPopupOpen] = useState(false)

  const center = [25.6, 71.5] // Chohtan/Barmer area
  const zoom = 11

  const handleMapClick = useCallback((latlng) => {
    setClickedPos(latlng)
    setForm({ name_en: '', name_hi: '', stop_order: '' }) // reset form
    setPopupOpen(true)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!clickedPos) return
    const newStop = {
      lat: clickedPos.lat,
      lng: clickedPos.lng,
      name_en: form.name_en,
      name_hi: form.name_hi,
      stop_order: parseInt(form.stop_order) || 0,
    }
    onAddStop(newStop)
    setPopupOpen(false)
    setClickedPos(null)
  }

  return (
    <div className="w-full h-[60vh] rounded-xl overflow-hidden shadow-lg border-2 border-[#B4542C]/30 mb-8">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onMapClick={handleMapClick} />

        {/* Existing stops markers */}
        {existingStops.map((stop) => (
          <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={existingIcon}>
            <Popup>
              <div className="text-sm">
                <strong>{stop.name_en}</strong><br />
                {stop.name_hi}<br />
                Order: {stop.stop_order}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* New stop preview marker */}
        {clickedPos && popupOpen && (
          <Marker position={clickedPos} icon={newStopIcon}>
            <Popup>
              <form onSubmit={handleSubmit} className="space-y-2 w-48">
                <h3 className="font-semibold text-center text-[#8B3A3A]">Add Stop Here</h3>
                <input
                  placeholder="Name (English)*"
                  value={form.name_en}
                  onChange={e => setForm({ ...form, name_en: e.target.value })}
                  className="w-full border p-1 rounded text-sm"
                  required
                />
                <input
                  placeholder="Name (Hindi)*"
                  value={form.name_hi}
                  onChange={e => setForm({ ...form, name_hi: e.target.value })}
                  className="w-full border p-1 rounded text-sm"
                  required
                />
                <input
                  type="number"
                  placeholder="Stop Order"
                  value={form.stop_order}
                  onChange={e => setForm({ ...form, stop_order: e.target.value })}
                  className="w-full border p-1 rounded text-sm"
                />
                <div className="text-xs text-gray-500">
                  Lat: {clickedPos.lat.toFixed(5)}, Lng: {clickedPos.lng.toFixed(5)}
                </div>
                <button type="submit" className="w-full bg-[#B4542C] text-white py-1 rounded text-sm hover:bg-[#8B3A3A]">
                  Add Stop
                </button>
              </form>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}