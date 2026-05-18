'use client'
import { motion } from 'framer-motion'

export default function FacultyPage() {
  const faculty = [
    {
      name: 'Mr. Suresh Choudhary',
      qualification: 'M.Sc., B.Ed.',
      subject: 'Physics',
      experience: '4 Years',
      department: 'Science'
    },
    {
      name: 'Mrs. Jagdish kumar ujjwal',
      qualification: 'M.A., B.Ed.',
      subject: 'English',
      experience: '10 Years',
      department: 'Languages'
    },
    {
      name: 'Mr. Suresh Kumar Jyani',
      qualification: 'M.Sc., B.Ed.',
      subject: 'Mathematics',
      experience: '4 Years',
      department: 'Mathematics'
    },
    {
      name: 'Praveen Choudhary',
      qualification: 'M.A., B.Ed.',
      subject: 'Hindi',
      experience: '4 Years',
      department: 'Languages'
    },
    {
      name: 'Mr. Himanshu soni',
      qualification: 'M.Sc., B.Ed.',
      subject: 'Chemistry',
      experience: '7 Years',
      department: 'Science'
    },
    {
      name: 'Mr. Babu lal vishnoi',
      qualification: 'M.Com., B.Ed.',
      subject: 'Geography',
      experience: '15 Years',
      department: 'Arts'
    },
    {
      name: 'Mr. Pradeep kumar',
      qualification: 'M.A., B.P.Ed.',
      subject: 'Physical Education',
      experience: '5 Years',
      department: 'Sports'
    },
    {
      name: 'Mrs. Dev sharma',
      qualification: 'MCA, B.Ed.',
      subject: 'Computer Science',
      experience: '10 Years',
      department: 'Computer'
    }
  ]

  const departments = ['All', 'Science', 'Mathematics', 'Languages', 'Arts', 'Sports', 'Computer']

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
              { number: '50+', label: 'Total Teachers' },
              { number: '80%', label: 'Post Graduate' },
              { number: '15+', label: 'Avg Experience (Years)' },
              { number: '1:25', label: 'Teacher-Student Ratio' }
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
            {departments.map((dept, index) => (
              <button
                key={index}
                className="px-6 py-2 rounded-full border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition-all font-medium"
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Teachers Grid */}
          <div className="grid md:grid-cols-4 gap-6">
            {faculty.map((teacher, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card text-center group hover:shadow-2xl transition-all"
              >
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <span className="text-4xl">👨‍🏫</span>
                </div>
                <h3 className="text-xl font-semibold mb-1">{teacher.name}</h3>
                <p className="text-primary-500 font-medium text-sm mb-1">{teacher.subject}</p>
                <p className="text-gray-500 text-sm mb-2">{teacher.qualification}</p>
                <div className="inline-block bg-primary-50 text-primary-500 px-3 py-1 rounded-full text-xs font-medium">
                  {teacher.experience} Experience
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
