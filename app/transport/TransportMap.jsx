'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { createClient } from '@supabase/supabase-js'

// Supabase client (anon key – public data)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Fix default icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default function TransportMap() {
  const [allRoutes, setAllRoutes] = useState([])
  const [stopsByRoute, setStopsByRoute] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    // Fetch routes
    const { data: routes, error: routeError } = await supabase
      .from('bus_routes')
      .select('*')
      .order('id')
    if (routeError) {
      console.error('Error fetching routes:', routeError)
      setLoading(false)
      return
    }

    // Fetch all stops
    const { data: stops, error: stopError } = await supabase
      .from('bus_stops')
      .select('*')
      .order('stop_order')
    if (stopError) {
      console.error('Error fetching stops:', stopError)
      setLoading(false)
      return
    }

    // Group stops by route_id
    const grouped = {}
    stops.forEach(stop => {
      if (!grouped[stop.route_id]) grouped[stop.route_id] = []
      grouped[stop.route_id].push(stop)
    })

    setAllRoutes(routes || [])
    setStopsByRoute(grouped)
    setLoading(false)
  }

  if (loading) return <div className="text-center py-20">Loading bus routes...</div>
  if (allRoutes.length === 0) return <div className="text-center py-20 text-gray-500">No bus routes available yet.</div>

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
            // Use route_points if available, otherwise fallback to stop coordinates
            const polylineCoords = route.route_points
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

      {/* Legend */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-[#8B3A3A] mb-4">Bus Routes & Stops</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allRoutes.map(route => {
            const stops = stopsByRoute[route.id] || []
            return (
              <div key={route.id} className="bg-white rounded-lg shadow p-4 border-l-4" style={{ borderColor: route.color }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: route.color }}></span>
                  <h3 className="font-semibold text-gray-800">{route.name_en}</h3>
                  <span className="text-sm text-gray-500">({route.name_hi})</span>
                </div>
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