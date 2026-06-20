'use client'

import dynamic from 'next/dynamic'

const TransportMap = dynamic(() => import('./TransportMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B3A3A]"></div>
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
    </div>
  )
}