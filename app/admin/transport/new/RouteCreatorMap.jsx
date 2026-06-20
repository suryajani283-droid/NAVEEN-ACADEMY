'use client'

import { useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const stopIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})

const routePointIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click(e) { onMapClick(e.latlng) } })
  return null
}

export default function RouteCreatorMap({ routePoints, onAddRoutePoint, onRemoveRoutePoint, stops, onAddStop, onRemoveStop, routeColor }) {
  const [mode, setMode] = useState('route') // 'route' or 'stop'
  const [tempMarker, setTempMarker] = useState(null)
  const [form, setForm] = useState({ name_en: '', name_hi: '' })

  const center = [25.6, 71.5]
  const zoom = 11

  const handleMapClick = useCallback((latlng) => {
    if (mode === 'route') {
      // Add route point immediately (no popup needed)
      onAddRoutePoint({ lat: latlng.lat, lng: latlng.lng })
    } else {
      // Stop mode – show popup for name
      setTempMarker(latlng)
      setForm({ name_en: '', name_hi: '' })
    }
  }, [mode, onAddRoutePoint])

  const handleStopSubmit = (e) => {
    e.preventDefault()
    if (!tempMarker || !form.name_en || !form.name_hi) return
    onAddStop({
      lat: tempMarker.lat,
      lng: tempMarker.lng,
      name_en: form.name_en,
      name_hi: form.name_hi,
    })
    setTempMarker(null)
  }

  // Polyline from routePoints array (already sorted by insertion)
  const polyCoords = routePoints.map(p => [p.lat, p.lng])

  return (
    <div className="space-y-2">
      {/* Mode toggle + instructions */}
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => setMode('route')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${mode === 'route' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          🛣️ Draw Road
        </button>
        <button
          onClick={() => setMode('stop')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${mode === 'stop' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          🚏 Add Stop
        </button>
        <span className="text-xs text-gray-500">
          {mode === 'route' ? 'Click on map to add road points' : 'Click on map to place a bus stop'}
        </span>
      </div>

      <div className="w-full h-[60vh] rounded-xl overflow-hidden shadow-lg border-2 border-[#B4542C]/30">
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Streets">
              <TileLayer attribution='&copy; <a href="https://carto.com/">CARTO</a>' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer attribution='&copy; <a href="https://www.esri.com/">ESRI</a>' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            </LayersControl.BaseLayer>
          </LayersControl>

          <MapClickHandler onMapClick={handleMapClick} />

          {/* Route points (blue markers) */}
          {routePoints.map((point, idx) => (
            <Marker key={`rp-${idx}`} position={[point.lat, point.lng]} icon={routePointIcon}>
              <Popup>
                <div className="text-sm">
                  Road Point {idx + 1}
                  <br />
                  <button onClick={() => onRemoveRoutePoint(idx)} className="text-red-500 hover:underline">Remove</button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Stops (green markers) */}
          {stops.map((stop, idx) => (
            <Marker key={`stop-${idx}`} position={[stop.lat, stop.lng]} icon={stopIcon}>
              <Popup>
                <div className="text-sm">
                  <strong>{stop.name_en}</strong><br />
                  {stop.name_hi}
                  <br />
                  <button onClick={() => onRemoveStop(idx)} className="text-red-500 hover:underline">Remove</button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Temporary stop marker (during popup) */}
          {tempMarker && (
            <Marker position={tempMarker} icon={stopIcon}>
              <Popup>
                <form onSubmit={handleStopSubmit} className="space-y-2 w-48">
                  <h3 className="font-semibold text-center text-[#8B3A3A]">New Stop</h3>
                  <input placeholder="Name (English)*" value={form.name_en} onChange={e => setForm({...form, name_en: e.target.value})} className="w-full border p-1 rounded text-sm" required />
                  <input placeholder="Name (Hindi)*" value={form.name_hi} onChange={e => setForm({...form, name_hi: e.target.value})} className="w-full border p-1 rounded text-sm" required />
                  <div className="text-xs text-gray-500">Lat: {tempMarker.lat.toFixed(5)}, Lng: {tempMarker.lng.toFixed(5)}</div>
                  <button type="submit" className="w-full bg-[#B4542C] text-white py-1 rounded text-sm hover:bg-[#8B3A3A]">Add Stop</button>
                </form>
              </Popup>
            </Marker>
          )}

          {/* Route Polyline */}
          {polyCoords.length > 1 && (
            <Polyline positions={polyCoords} color={routeColor} weight={4} opacity={0.8} />
          )}
        </MapContainer>
      </div>
    </div>
  )
}