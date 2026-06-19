'use client'

import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Sample routes (replace with real data later)
const allRoutes = [
  {
    id: 1,
    name_en: 'Chohtan - Barmer',
    name_hi: 'चौहटन - बाड़मेर',
    color: '#E53E3E',
    stops: [
      { id: 1, name_en: 'Chohtan', name_hi: 'चौहटन', lat: 25.482, lng: 71.073 },
      { id: 2, name_en: 'Barmer', name_hi: 'बाड़मेर', lat: 25.750, lng: 71.380 },
      { id: 3, name_en: 'Kawas', name_hi: 'कवास', lat: 25.6, lng: 71.2 },
    ]
  },
  // ... other routes same as before ...
]

const mapCenter = [25.6, 71.5]
const mapZoom = 9

export default function TransportMap() {
  return (
    <>
      <div className="w-full h-[70vh] rounded-xl overflow-hidden shadow-lg border-2 border-[#B4542C]/30 mb-8">
        <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <LayersControl position="topright">
            {/* Modern Streets (like Google Maps) */}
            <LayersControl.BaseLayer checked name="Streets">
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
            </LayersControl.BaseLayer>

            {/* Satellite (free from ESRI) */}
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                attribution='&copy; <a href="https://www.esri.com/">ESRI</a>'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {/* Routes and markers (same as before) */}
          {allRoutes.map((route) => {
            const routeCoords = route.stops.map(s => [s.lat, s.lng])
            return (
              <div key={route.id}>
                <Polyline positions={routeCoords} color={route.color} weight={4} opacity={0.8} />
                {route.stops.map((stop) => (
                  <Marker key={`${route.id}-${stop.id}`} position={[stop.lat, stop.lng]}>
                    <Popup>
                      <div className="text-center">
                        <p className="font-semibold text-[#B4542C]">{stop.name_en}</p>
                        <p className="text-sm text-gray-500">{stop.name_hi}</p>
                        <p className="text-xs mt-1" style={{ color: route.color }}>{route.name_en} ({route.name_hi})</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </div>
            )
          })}
        </MapContainer>
      </div>

      {/* Legend and stop list (same as before) */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-[#8B3A3A] mb-4">Bus Routes & Stops (बस रूट और स्टॉप)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allRoutes.map((route) => (
            <div key={route.id} className="bg-white rounded-lg shadow p-4 border-l-4" style={{ borderColor: route.color }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: route.color }}></span>
                <h3 className="font-semibold text-gray-800">{route.name_en}</h3>
                <span className="text-sm text-gray-500">({route.name_hi})</span>
              </div>
              <ul className="space-y-2">
                {route.stops.map((stop, idx) => (
                  <li key={stop.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">
                      <span className="font-medium">{idx + 1}.</span> {stop.name_en} <span className="text-gray-400">({stop.name_hi})</span>
                    </span>
                    <span className="text-xs text-gray-400">{stop.lat.toFixed(2)}, {stop.lng.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-sm text-center mt-6 text-gray-500">*Routes and stops are subject to change. Contact school for latest info.</p>
      </div>
    </>
  )
}