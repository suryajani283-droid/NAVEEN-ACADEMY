'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const classes = ['All', '10', '11', '12']

export default function BoardResultsPage() {
  const [students, setStudents] = useState([])
  const [activeClass, setActiveClass] = useState('All')
  const [year, setYear] = useState('2025-26')   // ✅ year state (default)

  // Fetch the dynamic year from homepage_content
  useEffect(() => {
    const fetchYear = async () => {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('content')
        .eq('section', 'board_results_year')
        .single()
      if (!error && data?.content) {
        // content is stored as a JSON string, e.g. "2025-26"
        setYear(JSON.parse(data.content))
      }
    }
    fetchYear()
  }, [])

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      const { data } = await supabase
        .from('board_results')
        .select('*')
        .order('created_at', { ascending: false })
      setStudents(data || [])
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
                className="card text-center relative overflow-visible"   // ✅ relative + overflow-visible
              >
                {/* ✅ Dynamic Year Ribbon */}
                <div className="absolute -top-1 -right-1 w-20 h-20 overflow-hidden">
                  <div className="absolute top-2 -right-3 z-10">
  <div className="bg-amber-500 text-white text-xs font-bold px-6 py-1 transform rotate-45 translate-x-1/3 -translate-y-1/3 shadow-md whitespace-nowrap">
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