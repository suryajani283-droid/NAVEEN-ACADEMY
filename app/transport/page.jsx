'use client'

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Sample bus stops – replace with your actual data later
const busStops = [
  { id: 1, name_en: 'Chohtan', name_hi: 'चौहटन', lat: 25.482, lng: 71.073 },
  { id: 2, name_en: 'Barmer', name_hi: 'बाड़मेर', lat: 25.750, lng: 71.380 },
  { id: 3, name_en: 'Balotra', name_hi: 'बालोतरा', lat: 25.833, lng: 72.233 },
  { id: 4, name_en: 'Baytoo', name_hi: 'बायतू', lat: 25.900, lng: 71.767 },
  { id: 5, name_en: 'Guda Malani', name_hi: 'गुड़ामालानी', lat: 25.733, lng: 71.283 },
]

// Arrange stops in order for the route
const routeCoords = busStops.map(stop => [stop.lat, stop.lng])

const mapCenter = [25.6, 71.5] // Center of Barmer district
const mapZoom = 9

export default function TransportPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-24 md:mt-28">
      <h1 className="text-3xl font-bold text-center text-[#8B3A3A] mb-2">
        School Bus Route
      </h1>
      <p className="text-center text-gray-600 mb-8">
        स्कूल बस मार्ग – Barmer, Rajasthan
      </p>

      <div className="w-full h-[70vh] rounded-xl overflow-hidden shadow-lg border-2 border-[#B4542C]/30">
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

          {/* Route line */}
          <Polyline
            positions={routeCoords}
            color="#8B3A3A"
            weight={4}
            opacity={0.7}
            dashArray="10 6"
          />

          {/* Bus stop markers */}
          {busStops.map((stop) => (
            <Marker key={stop.id} position={[stop.lat, stop.lng]}>
              <Popup>
                <div className="text-center">
                  <span className="font-semibold text-[#B4542C]">{stop.name_en}</span>
                  <br />
                  <span className="text-sm text-gray-500">{stop.name_hi}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Stop list for reference */}
      <div className="mt-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-[#8B3A3A] mb-4">Bus Stops (बस स्टॉप)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {busStops.map((stop) => (
            <div
              key={stop.id}
              className="p-3 bg-white rounded-lg shadow flex justify-between items-center border-l-4 border-[#B4542C]"
            >
              <div>
                <p className="font-medium text-gray-800">{stop.name_en}</p>
                <p className="text-sm text-gray-500">{stop.name_hi}</p>
              </div>
              <span className="text-xs text-gray-400">
                {stop.lat.toFixed(3)}, {stop.lng.toFixed(3)}
              </span>
            </div>
          ))}
        </div>
        <p className="text-sm text-center mt-4 text-gray-500">
          *Route and stops are subject to change. Contact school for latest info.
        </p>
      </div>
    </div>
  )
}