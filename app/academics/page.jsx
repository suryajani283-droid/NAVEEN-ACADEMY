'use client'
import { motion } from 'framer-motion'
import { AcademicCapIcon, BookOpenIcon, BeakerIcon, CalculatorIcon } from '@heroicons/react/24/outline'

export default function AcademicsPage() {
  const streams = [
    {
      name: 'Science Stream',
      icon: BeakerIcon,
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology/Computer Science', 'English', 'Hindi'],
      careers: 'Engineering, Medical, Research, Biotechnology'
    },
    {
      name: 'Arts Stream',
      icon: BookOpenIcon,
      subjects: ['History', 'Geography', 'Political Science', 'Economics', 'English', 'Hindi'],
      careers: 'Civil Services, Teaching, Law, Journalism'
    },
    {
      name: 'Commerce Stream',
      icon: CalculatorIcon,
      subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English', 'Hindi'],
      careers: 'CA, MBA, Banking, Finance, Entrepreneurship'
    }
  ]

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
            Academics
          </motion.h1>
          <p className="text-xl">Comprehensive Curriculum for Holistic Development</p>
        </div>
      </section>

      {/* Curriculum Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-500 text-center mb-12">Our Curriculum</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { level: 'Primary', classes: 'I-V', focus: 'Foundation building with activity-based learning' },
              { level: 'Middle', classes: 'VI-VIII', focus: 'Conceptual understanding and skill development' },
              { level: 'Secondary', classes: 'IX-X', focus: 'Board exam preparation and career guidance' },
              { level: 'Senior Secondary', classes: 'XI-XII', focus: 'Stream specialization and competitive exams' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="text-4xl font-bold text-primary-500 mb-3">{item.classes}</div>
                <h3 className="text-xl font-semibold mb-2">{item.level}</h3>
                <p className="text-gray-600 text-sm">{item.focus}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Streams for Senior Secondary */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-500 text-center mb-12">
            Senior Secondary Streams (Class XI-XII)
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {streams.map((stream, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="card hover:shadow-2xl transition-all"
              >
                <stream.icon className="h-16 w-16 text-primary-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-center mb-4">{stream.name}</h3>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Subjects:</h4>
                  <ul className="space-y-1">
                    {stream.subjects.map((subject, i) => (
                      <li key={i} className="text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                        {subject}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Career Options:</h4>
                  <p className="text-gray-600 text-sm">{stream.careers}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Examination Pattern */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-500 text-center mb-12">Examination Pattern</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Periodic Tests', desc: 'Monthly tests to assess continuous learning and understanding' },
              { title: 'Half-Yearly Exams', desc: 'Comprehensive examination covering first term syllabus' },
              { title: 'Annual Exams', desc: 'Final examination covering complete academic year syllabus' }
            ].map((exam, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card text-center"
              >
                <AcademicCapIcon className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{exam.title}</h3>
                <p className="text-gray-600">{exam.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* School Timings */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">School Timings</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Summer (Apr-Sep)</h3>
              <p className="text-2xl font-bold">7:30 AM - 1:30 PM</p>
              <p className="text-sm mt-2">Monday to Saturday</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Winter (Oct-Mar)</h3>
              <p className="text-2xl font-bold">8:30 AM - 2:30 PM</p>
              <p className="text-sm mt-2">Monday to Saturday</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
