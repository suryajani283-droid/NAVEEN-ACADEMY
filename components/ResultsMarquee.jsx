'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'

const students = [
  {
    name: 'Rahul Sharma',
    achievement: 'RBSE 10th - 98.6%',
    img: '/images/topper1.jpg',
  },
  {
    name: 'Priya Patel',
    achievement: 'RBSE 12th (Science) - 96.4%',
    img: '/images/topper2.jpg',
  },
  {
    name: 'Arjun Singh',
    achievement: 'State Level Cricket',
    img: '/images/player1.jpg',
  },
  {
    name: 'Sakshi Joshi',
    achievement: 'RBSE 12th (Arts) - 95.2%',
    img: '/images/topper3.jpg',
  },
  {
    name: 'Vikram Rathore',
    achievement: 'National Athletics',
    img: '/images/player2.jpg',
  },
]

export default function ResultsMarquee() {
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let animationId
    const speed = 0.5 // पिक्सेल प्रति फ्रेम

    function step() {
      el.scrollLeft = (el.scrollLeft + speed) % (el.scrollWidth / 2)
      animationId = requestAnimationFrame(step)
    }

    animationId = requestAnimationFrame(step)

    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <div className="relative w-full overflow-hidden bg-transparent">
      <div
        ref={scrollRef}
        className="flex overflow-x-hidden py-6 px-4 space-x-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {[...students, ...students].map((student, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex flex-col items-center space-y-2 w-36"
          >
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary-500 shadow-lg">
              <Image
                src={student.img}
                alt={student.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-primary-500 leading-tight">
                {student.achievement}
              </p>
              <p className="text-xs text-gray-600 mt-1">{student.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
