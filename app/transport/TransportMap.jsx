'use client'

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Sample multiple routes – replace with real data later
const allRoutes = [
  {
    id: 1,
    name_en: 'Chohtan - Barmer',
    name_hi: 'चौहटन - बाड़मेर',
    color: '#E53E3E', // red
    stops: [
      { id: 1, name_en: 'Chohtan', name_hi: 'चौहटन', lat: 25.482, lng: 71.073 },
      { id: 2, name_en: 'Barmer', name_hi: 'बाड़मेर', lat: 25.750, lng: 71.380 },
      { id: 3, name_en: 'Kawas', name_hi: 'कवास', lat: 25.6, lng: 71.2 },
    ]
  },
  {
    id: 2,
    name_en: 'Chohtan - Balotra',
    name_hi: 'चौहटन - बालोतरा',
    color: '#3182CE', // blue
    stops: [
      { id: 4, name_en: 'Chohtan', name_hi: 'चौहटन', lat: 25.482, lng: 71.073 },
      { id: 5, name_en: 'Baytoo', name_hi: 'बायतू', lat: 25.900, lng: 71.767 },
      { id: 6, name_en: 'Balotra', name_hi: 'बालोतरा', lat: 25.833, lng: 72.233 },
    ]
  },
  {
    id: 3,
    name_en: 'Barmer - Guda Malani',
    name_hi: 'बाड़मेर - गुड़ामालानी',
    color: '#38A169', // green
    stops: [
      { id: 7, name_en: 'Barmer', name_hi: 'बाड़मेर', lat: 25.750, lng: 71.380 },
      { id: 8, name_en: 'Guda Malani', name_hi: 'गुड़ामालानी', lat: 25.733, lng: 71.283 },
    ]
  },
  {
    id: 4,
    name_en: 'Balotra - Pachpadra',
    name_hi: 'बालोतरा - पचपदरा',
    color: '#D69E2E', // yellow
    stops: [
      { id: 9, name_en: 'Balotra', name_hi: 'बालोतरा', lat: 25.833, lng: 72.233 },
      { id: 10, name_en: 'Pachpadra', name_hi: 'पचपदरा', lat: 25.917, lng: 71.633 },
    ]
  },
  {
    id: 5,
    name_en: 'Chohtan - Dhorimanna',
    name_hi: 'चौहटन - धोरीमन्ना',
    color: '#805AD5', // purple
    stops: [
      { id: 11, name_en: 'Chohtan', name_hi: 'चौहटन', lat: 25.482, lng: 71.073 },
      { id: 12, name_en: 'Dhorimanna', name_hi: 'धोरीमन्ना', lat: 25.2, lng: 71.45 },
    ]
  },
]

const mapCenter = [25.6, 71.5] // center of Barmer district
const mapZoom = 9

export default function TransportMap() {
  return (
    <>
      {/* Map Container */}
      <div className="w-full h-[70vh] rounded-xl overflow-hidden shadow-lg border-2 border-[#B4542C]/30 mb-8">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render each route */}
          {allRoutes.map((route) => {
            const routeCoords = route.stops.map(s => [s.lat, s.lng])
            return (
              <div key={route.id}>
                {/* Route line */}
                <Polyline
                  positions={routeCoords}
                  color={route.color}
                  weight={4}
                  opacity={0.8}
                />
                {/* Markers for each stop in this route */}
                {route.stops.map((stop) => (
                  <Marker key={`${route.id}-${stop.id}`} position={[stop.lat, stop.lng]}>
                    <Popup>
                      <div className="text-center">
                        <p className="font-semibold text-[#B4542C]">{stop.name_en}</p>
                        <p className="text-sm text-gray-500">{stop.name_hi}</p>
                        <p className="text-xs mt-1" style={{ color: route.color }}>
                          {route.name_en} ({route.name_hi})
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </div>
            )
          })}
        </MapContainer>
      </div>

      {/* Legend & Stop List */}
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

        <p className="text-sm text-center mt-6 text-gray-500">
          *Routes and stops are subject to change. Contact school for latest info.
        </p>
      </div>
    </>
  )
}