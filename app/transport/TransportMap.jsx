'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { createClient } from '@supabase/supabase-js'

// Supabase public client (anon key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Helper functions for distance calculation
function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

function getDistanceFromLatLngInKm(lat1, lng1, lat2, lng2) {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLng = deg2rad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function calculateRouteDistance(routePoints) {
  if (!routePoints || routePoints.length < 2) return 0
  let total = 0
  for (let i = 0; i < routePoints.length - 1; i++) {
    const [lat1, lng1] = routePoints[i]
    const [lat2, lng2] = routePoints[i + 1]
    total += getDistanceFromLatLngInKm(lat1, lng1, lat2, lng2)
  }
  return total
}

export default function TransportMap() {
  const [allRoutes, setAllRoutes] = useState([])
  const [stopsByRoute, setStopsByRoute] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      // Fetch all routes
      const { data: routes, error: routeErr } = await supabase
        .from('bus_routes')
        .select('*')
        .order('id')
      if (routeErr) throw new Error(routeErr.message)

      // Fetch all stops
      const { data: stops, error: stopErr } = await supabase
        .from('bus_stops')
        .select('*')
        .order('stop_order')
      if (stopErr) throw new Error(stopErr.message)

      // Group stops by route_id
      const grouped = {}
      stops.forEach(stop => {
        if (!grouped[stop.route_id]) grouped[stop.route_id] = []
        grouped[stop.route_id].push(stop)
      })

      setAllRoutes(routes || [])
      setStopsByRoute(grouped)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B3A3A] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bus routes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error loading routes</p>
          <p className="text-sm">{error}</p>
          <button onClick={fetchData} className="mt-4 bg-[#B4542C] text-white px-4 py-2 rounded">
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (allRoutes.length === 0) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-gray-500 text-xl">No bus routes available yet.</p>
      </div>
    )
  }

  const mapCenter = [25.6, 71.5]
  const mapZoom = 10

  return (
    <>
      <div className="w-full h-[70vh] rounded-xl overflow-hidden shadow-lg border-2 border-[#B4542C]/30 mb-8">
        <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
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

          {allRoutes.map(route => {
            const routeStops = stopsByRoute[route.id] || []

            // Use drawn road path if available, else fallback to stops coordinates
            const polylineCoords = (route.route_points && route.route_points.length > 1)
              ? route.route_points
              : routeStops.map(s => [s.lat, s.lng])

            return (
              <div key={route.id}>
                {polylineCoords.length > 1 && (
                  <Polyline positions={polylineCoords} color={route.color} weight={4} opacity={0.8} />
                )}
                {routeStops.map(stop => (
                  <Marker key={stop.id} position={[stop.lat, stop.lng]}>
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

      {/* Legend and stop list */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-[#8B3A3A] mb-4">Bus Routes & Stops (बस रूट और स्टॉप)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allRoutes.map(route => {
            const stops = stopsByRoute[route.id] || []
            const polylineForDistance = (route.route_points && route.route_points.length > 1)
              ? route.route_points
              : stops.map(s => [s.lat, s.lng])
            const distanceKm = calculateRouteDistance(polylineForDistance)

            return (
              <div key={route.id} className="bg-white rounded-lg shadow p-4 border-l-4" style={{ borderColor: route.color }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: route.color }}></span>
                  <h3 className="font-semibold text-gray-800">{route.name_en}</h3>
                  <span className="text-sm text-gray-500">({route.name_hi})</span>
                </div>
                <p className="text-sm font-medium text-[#B4542C] mb-2">
                  📏 {distanceKm.toFixed(1)} km
                </p>
                <ul className="space-y-2">
                  {stops.map((stop, idx) => (
                    <li key={stop.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">
                        <span className="font-medium">{idx + 1}.</span> {stop.name_en} <span className="text-gray-400">({stop.name_hi})</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
        <p className="text-sm text-center mt-6 text-gray-500">
          *Routes and stops are subject to change. Contact school for latest info.
        </p>
      </div>
    </>
  )
}