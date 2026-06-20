'use client'

import { useState, useCallback, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const existingIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const newStopIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) { onMapClick(e.latlng) }
  })
  return null
}

export default function RouteCreatorMap({ stops, onAddStop, onRemoveStop, routeColor }) {
  const [tempMarker, setTempMarker] = useState(null)
  const [popupOpen, setPopupOpen] = useState(false)
  const [form, setForm] = useState({ name_en: '', name_hi: '' })

  const center = [25.6, 71.5] // Barmer area
  const zoom = 11

  const handleMapClick = useCallback((latlng) => {
    setTempMarker(latlng)
    setForm({ name_en: '', name_hi: '' })
    setPopupOpen(true)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!tempMarker || !form.name_en || !form.name_hi) return
    onAddStop({
      lat: tempMarker.lat,
      lng: tempMarker.lng,
      name_en: form.name_en,
      name_hi: form.name_hi,
    })
    setPopupOpen(false)
    setTempMarker(null)
  }

  const routeCoords = stops.map(s => [s.lat, s.lng])

  return (
    <div className="w-full h-[60vh] rounded-xl overflow-hidden shadow-lg border-2 border-[#B4542C]/30 mb-4">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Streets">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">ESRI</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <MapClickHandler onMapClick={handleMapClick} />

        {/* Existing stops */}
        {stops.map((stop, idx) => (
          <Marker key={idx} position={[stop.lat, stop.lng]} icon={existingIcon}>
            <Popup>
              <div className="text-sm">
                <strong>{stop.name_en}</strong><br />
                {stop.name_hi}
                <br />
                <button
                  onClick={() => onRemoveStop(idx)}
                  className="text-red-500 hover:underline mt-1"
                >
                  Remove
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Temporary green marker for new stop */}
        {tempMarker && popupOpen && (
          <Marker position={tempMarker} icon={newStopIcon}>
            <Popup>
              <form onSubmit={handleSubmit} className="space-y-2 w-48">
                <h3 className="font-semibold text-center text-[#8B3A3A]">New Stop</h3>
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
                <div className="text-xs text-gray-500">
                  Lat: {tempMarker.lat.toFixed(5)}, Lng: {tempMarker.lng.toFixed(5)}
                </div>
                <button type="submit" className="w-full bg-[#B4542C] text-white py-1 rounded text-sm hover:bg-[#8B3A3A]">
                  Add Stop
                </button>
              </form>
            </Popup>
          </Marker>
        )}

        {/* Route line */}
        {routeCoords.length > 1 && (
          <Polyline positions={routeCoords} color={routeColor} weight={4} opacity={0.8} />
        )}
      </MapContainer>
    </div>
  )
}