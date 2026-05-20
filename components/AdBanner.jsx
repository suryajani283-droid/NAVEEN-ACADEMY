'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AdBanner() {
  const [ads, setAds] = useState([])
  const scrollRef = useRef(null)

  useEffect(() => {
    const fetchAds = async () => {
      const { data } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false })
      setAds(data || [])
    }
    fetchAds()
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el || ads.length < 2) return

    let animationId
    const speed = 0.5

    function step() {
      const halfWidth = el.scrollWidth / 2
      el.scrollLeft = (el.scrollLeft + speed) % halfWidth
      animationId = requestAnimationFrame(step)
    }

    // Start only after we have a valid scroll width
    const startWhenReady = () => {
      if (el.scrollWidth > 0) {
        animationId = requestAnimationFrame(step)
      } else {
        requestAnimationFrame(startWhenReady)
      }
    }
    startWhenReady()

    return () => cancelAnimationFrame(animationId)
  }, [ads])

  if (!ads.length) return null

  // Duplicate the whole set for seamless loop
  const doubledAds = [...ads, ...ads]

  return (
    <div className="flex-1 flex items-stretch overflow-hidden bg-gray-50 border-t border-gray-200">
      <div
        ref={scrollRef}
        className="overflow-x-hidden w-full h-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div
          className="grid h-full gap-2 px-2"
          style={{
            gridAutoFlow: 'row',
            gridTemplateRows: 'repeat(auto-fill, 150px)',
            gridAutoColumns: '200px',
            width: 'max-content',
          }}
        >
          {doubledAds.map((ad, index) => (
            <a
              key={index}
              href={ad.link_url || '#'}
              target={ad.link_url ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              style={{ width: 200, height: 150 }}
            >
              <img
                src={ad.image_url}
                alt={ad.title || 'Advertisement'}
                className="w-full h-full object-cover"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
