'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function FacultyPage() {
  const [faculty, setFaculty] = useState([])
  const [activeDept, setActiveDept] = useState('All')

  useEffect(() => {
    const fetchFaculty = async () => {
      const { data } = await supabase
        .from('faculty')
        .select('*')
        .order('created_at', { ascending: false })
      setFaculty(data || [])
    }
    fetchFaculty()
  }, [])

  // Stats calculation
  const totalTeachers = faculty.length
  const postGradCount = faculty.filter(f => f.qualification?.toLowerCase().includes('m.')).length
  const postGradPercent = totalTeachers ? Math.round((postGradCount / totalTeachers) * 100) : 0
  const avgExperience = totalTeachers
    ? Math.round(faculty.reduce((sum, f) => sum + (f.experience || 0), 0) / totalTeachers)
    : 0
  const teacherStudentRatio = '1:25' // you can adjust or make dynamic if student count is available

  // Unique departments from data
  const departments = ['All', ...new Set(faculty.map(f => f.department).filter(Boolean))]

  const filteredFaculty = activeDept === 'All'
    ? faculty
    : faculty.filter(f => f.department === activeDept)

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Our Faculty
          </motion.h1>
          <p className="text-xl">Experienced & Dedicated Teachers Shaping Future Leaders</p>
        </div>
      </section>

      {/* Faculty Stats */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: `${totalTeachers}+`, label: 'Total Teachers' },
              { number: `${postGradPercent}%`, label: 'Post Graduate' },
              { number: `${avgExperience}+`, label: 'Avg Experience (Years)' },
              { number: teacherStudentRatio, label: 'Teacher-Student Ratio' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-500">{stat.number}</div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-500 text-center mb-12">Meet Our Teachers</h2>

          {/* Department Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`px-6 py-2 rounded-full border-2 transition-all font-medium ${
                  activeDept === dept
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'border-primary-500 text-primary-500 hover:bg-primary-50'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Teachers Grid */}
          <div className="grid md:grid-cols-4 gap-6">
            {filteredFaculty.map((teacher) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="card text-center group hover:shadow-2xl transition-all"
              >
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <img
                    src={teacher.image_url || '/images/placeholder.jpg'}
                    alt={teacher.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                  />
                  <span className="text-4xl" style={{ display: teacher.image_url ? 'none' : 'block' }}>👨‍🏫</span>
                </div>
                <h3 className="text-xl font-semibold mb-1">{teacher.name}</h3>
                <p className="text-primary-500 font-medium text-sm mb-1">{teacher.subject}</p>
                <p className="text-gray-500 text-sm mb-2">{teacher.qualification}</p>
                <div className="inline-block bg-primary-50 text-primary-500 px-3 py-1 rounded-full text-xs font-medium">
                  {teacher.experience} Years Experience
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Teaching Team</h2>
          <p className="text-xl mb-8">We're always looking for passionate educators</p>
          <button className="bg-white text-primary-500 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all">
            Apply Now
          </button>
        </div>
      </section>
    </div>
  )
}
