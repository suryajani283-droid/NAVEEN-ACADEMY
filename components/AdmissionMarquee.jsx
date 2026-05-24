'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function AdmissionMarquee() {
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let animationId
    const speed = 0.5

    function step() {
      el.scrollLeft = (el.scrollLeft + speed) % (el.scrollWidth / 2)
      animationId = requestAnimationFrame(step)
    }

    animationId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-orange-500 text-white overflow-hidden shadow-md">
      <div
        ref={scrollRef}
        className="flex overflow-x-hidden whitespace-nowrap py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Message repeated twice for seamless loop */}
        {[...Array(10)].map((_, i) => (
          <Link
            key={i}
            href="/admissions"
            className="inline-block px-8 text-sm md:text-base font-bold tracking-wider hover:text-orange-100 transition-colors"
          >
            🎓 Admission Open 2026-27 – Apply Now! 🎓
          </Link>
        ))}
        {[...Array(10)].map((_, i) => (
          <Link
            key={`dup-${i}`}
            href="/admission"
            className="inline-block px-8 text-sm md:text-base font-bold tracking-wider hover:text-orange-100 transition-colors"
          >
            🎓 Admission Open 2026-27 – Apply Now! 🎓
          </Link>
        ))}
      </div>
    </div>
  )
}