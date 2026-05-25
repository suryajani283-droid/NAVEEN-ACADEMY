
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const classes = ['All', '10', '11', '12']

// Extract percentage number from achievement string (e.g., "98.6%")
function extractPercentage(achievement) {
  const match = String(achievement).match(/(\d+(\.\d+)?)%/)
  return match ? parseFloat(match[1]) : 0
}

export default function BoardResultsPage() {
  const [students, setStudents] = useState([])
  const [activeClass, setActiveClass] = useState('All')
  const [year, setYear] = useState('2025-26')

  // Fetch dynamic year
  useEffect(() => {
    const fetchYear = async () => {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('content')
        .eq('section', 'board_results_year')
        .single()
      if (!error && data?.content) {
        setYear(JSON.parse(data.content))
      }
    }
    fetchYear()
  }, [])

  // Fetch students, sort by percentage, assign rank
  useEffect(() => {
    const fetchStudents = async () => {
      const { data } = await supabase
        .from('board_results')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        // Calculate percentage and sort
        const withPercentage = data.map(s => ({
          ...s,
          percentage: extractPercentage(s.achievement),
        }))
        withPercentage.sort((a, b) => b.percentage - a.percentage)

        // Assign rank (1-based, same percentage gets same rank)
        let rank = 1
        const ranked = withPercentage.map((s, index) => {
          if (index > 0 && s.percentage < withPercentage[index - 1].percentage) {
            rank = index + 1
          }
          return { ...s, rank }
        })
        setStudents(ranked)
      } else {
        setStudents([])
      }
    }
    fetchStudents()
  }, [])

  const filtered = activeClass === 'All'
    ? students
    : students.filter(s => s.class === activeClass)

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            🏆 Board Results & Achievements
          </motion.h1>
          <p className="text-xl text-white/80">Our Proud Achievers</p>
        </div>
      </section>

      {/* Class Filter */}
      <section className="py-8 bg-white shadow-md sticky top-20 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {classes.map((cls) => (
              <button
                key={cls}
                onClick={() => setActiveClass(cls)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeClass === cls
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-primary-500 border-2 border-primary-500 hover:bg-primary-50'
                }`}
              >
                {cls === 'All' ? 'All Classes' : `Class ${cls}`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filtered.map((student) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card text-center relative overflow-visible bg-white"
              >
                {/* ---------- RANK BADGE (top-left, inside card) ---------- */}
                <div className="absolute -top-3 -left-3 z-20">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex flex-col items-center justify-center shadow-xl border-4 border-white">
                    <span className="text-lg font-extrabold leading-none">{student.rank}</span>
                    <span className="text-[10px] font-medium leading-none">Rank</span>
                  </div>
                </div>

                {/* ---------- FOLDED RIBBON (top-right) ---------- */}
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden z-10">
                  <div className="absolute -top-1 right-0 w-32 bg-amber-500 text-white text-xs font-bold text-center py-1 shadow-lg transform rotate-45 translate-x-10 -translate-y-4">
                    {year}
                  </div>
                </div>

                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary-500 shadow-lg">
                  <img
                    src={student.img}
                    alt={student.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/images/default-avatar.png' }}
                  />
                </div>
                <h3 className="text-xl font-bold text-primary-500">{student.name}</h3>
                <p className="text-gray-600 mt-2">{student.achievement}</p>
                <span className="inline-block mt-3 bg-primary-50 text-primary-600 px-4 py-1 rounded-full text-sm font-medium">
                  Class {student.class}
                </span>
              </motion.div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-12">No results for this class yet.</p>
          )}
        </div>
      </section>
    </div>
  )
}
