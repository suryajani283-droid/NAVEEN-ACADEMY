'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'

const students = [
  {
    name: 'Rahul Kumar',
    achievement: 'RBSE 12th (Arts) - 97.60%',
    img: '/images/topper1.jpg',
  },
    {
    name: 'Prameshwari',
    achievement: 'RBSE 12th (Science) - 95.00%',
    img: '/images/Parmeshwari.jpg',
  },
    {
    name: 'Gogaram',
    achievement: 'RBSE 12th (Arts) - 95.00%',
    img: '/images/goga.jpg',
  },
  {
    name: 'Kalpna',
    achievement: 'RBSE 12th (Arts) - 93.00%',
    img: '/images/Kalpna.jpg',
  },
    {
    name: 'Kiran Patel',
    achievement: 'RBSE 12th (Science) - 91.40%',
    img: '/images/kiran.jpg',
  },
  {
    name: 'Sunil kumar',
    achievement: 'RBSE 10th - 94.83%',
    img: '/images/sunil.jpg',
  },
    {
    name: 'Tejendra Godara',
    achievement: 'RBSE 10th - 91.83%',
    img: '/images/tejendra.jpg',
  },
  {
    name: 'Kheemraj',
    achievement: 'State Level Netball',
    img: '/images/player1.jpg',
  },
  {
    name: 'Saban Khan',
    achievement: 'State Level Netball',
    img: '/images/player1.jpg',
  },
  {
    name: 'Rajesh Kumar',
    achievement: 'State Level Netball',
    img: '/images/player1.jpg',
  },
  {
    name: 'Mandeep',
    achievement: 'State Level Netball',
    img: '/images/player1.jpg',
  },
  {
    name: 'Kavita',
    achievement: 'State Level Netball',
    img: '/images/player2.jpg',
  },
    {
    name: 'Mahesh mahiya',
    achievement: 'Navodaya Selected',
    img: '/images/player1.jpg',
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
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-primary-500">
              <Image
                src={student.img}
                alt={student.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="text-center">
  <p className="text-sm font-bold text-white drop-shadow-lg leading-tight">
    {student.achievement}
  </p>
  <p className="text-xs text-white/90 drop-shadow-md mt-1">
    {student.name}
  </p>
</div>
          </div>
        ))}
      </div>
    </div>
  );
}
