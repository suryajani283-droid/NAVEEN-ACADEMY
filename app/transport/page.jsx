'use client'

import dynamic from 'next/dynamic'

// Dynamically import the map component with SSR disabled
const TransportMap = dynamic(() => import('./TransportMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B3A3A] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Map...</p>
      </div>
    </div>
  ),
})

export default function TransportPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-24 md:mt-28">
      <h1 className="text-3xl font-bold text-center text-[#8B3A3A] mb-2">
        School Bus Route
      </h1>
      <p className="text-center text-gray-600 mb-8">
        स्कूल बस मार्ग – Barmer, Rajasthan
      </p>

      <TransportMap />

      <div className="mt-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-[#8B3A3A] mb-4">Bus Stops (बस स्टॉप)</h2>
        <p className="text-sm text-center mt-4 text-gray-500">
          *Route and stops are subject to change. Contact school for latest info.
        </p>
      </div>
    </div>
  )
}