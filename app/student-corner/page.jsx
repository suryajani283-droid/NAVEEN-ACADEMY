'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'
import {
  BookOpenIcon,
  DocumentTextIcon,
  ClockIcon,
  AcademicCapIcon,
  ArrowDownTrayIcon,
  BeakerIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function StudentCornerPage() {
  const [activeTab, setActiveTab] = useState('homework')
  const [homeworkList, setHomeworkList] = useState([])   // ← नया state

  // होमवर्क डेटा Supabase से लाएँ
  useEffect(() => {
    const fetchHomework = async () => {
      const { data } = await supabase
        .from('homework')
        .select('*')
        .order('created_at', { ascending: false })
      setHomeworkList(data || [])
    }
    fetchHomework()
  }, [])

  const tabs = [
    { id: 'homework', name: 'Homework', icon: BookOpenIcon },
    { id: 'notes', name: 'Notes', icon: DocumentTextIcon },
    { id: 'results', name: 'Results', icon: AcademicCapIcon },
    { id: 'downloads', name: 'Downloads', icon: ArrowDownTrayIcon },
    { id: 'timetable', name: 'Time Table', icon: ClockIcon },
  ]
}

  const homework = [
    { class: 'Class 10', subject: 'Mathematics', topic: 'Quadratic Equations', date: '2024-03-20', status: 'Pending' },
    { class: 'Class 10', subject: 'Science', topic: 'Chemical Reactions', date: '2024-03-19', status: 'Pending' },
    { class: 'Class 9', subject: 'English', topic: 'Letter Writing', date: '2024-03-20', status: 'Pending' },
    { class: 'Class 12', subject: 'Physics', topic: 'Optics Numericals', date: '2024-03-18', status: 'Completed' }
  ]

  const notes = [
    { subject: 'Mathematics', topic: 'Trigonometry Formulas', class: '10', type: 'PDF' },
    { subject: 'Science', topic: 'Human Body Systems', class: '9', type: 'PDF' },
    { subject: 'English', topic: 'Grammar Rules', class: '10', type: 'PDF' },
    { subject: 'Social Science', topic: 'Indian History Timeline', class: '10', type: 'PDF' }
  ]

  const timetable = [
    { day: 'Monday', periods: ['Maths', 'Science', 'English', 'Hindi', 'Social Science', 'Computer'] },
    { day: 'Tuesday', periods: ['English', 'Maths', 'Science', 'Sanskrit', 'Art', 'Sports'] },
    { day: 'Wednesday', periods: ['Science', 'Hindi', 'Maths', 'English', 'Social Science', 'Library'] },
    { day: 'Thursday', periods: ['Social Science', 'Computer', 'Science', 'Maths', 'English', 'Moral Science'] },
    { day: 'Friday', periods: ['Hindi', 'English', 'Maths', 'Science', 'Sports', 'Activity'] },
    { day: 'Saturday', periods: ['Revision', 'Tests', 'Activities', 'Club'] }
  ]

  const downloads = [
    { name: 'Syllabus 2024-25', type: 'PDF', size: '2.1 MB' },
    { name: 'Practical File Format', type: 'PDF', size: '1.5 MB' },
    { name: 'Project Guidelines', type: 'PDF', size: '3.2 MB' },
    { name: 'Exam Preparation Tips', type: 'PDF', size: '0.8 MB' },
    { name: 'Lab Manual', type: 'PDF', size: '4.5 MB' },
    { name: 'Previous Year Papers', type: 'ZIP', size: '15 MB' }
  ]

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
            Student Corner 📚
          </motion.h1>
          <p className="text-xl">All Study Materials, Homework & Resources in One Place</p>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="bg-white shadow-md sticky top-20 z-30">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:bg-primary-50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12">
        <div className="container mx-auto px-4">

          {activeTab === 'homework' && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
    <h2 cl{activeTab === 'homework' && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
    {homeworkList.map((hw, index) => (
      <motion.div key={hw.id} className="card">
        <p className="font-semibold">{hw.subject}</p>
        <p className="text-sm text-gray-600">{hw.topic}</p>
        <p className="text-xs text-gray-400">Class {hw.class}</p>
      </motion.div>
    ))}
    {homeworkList.length === 0 && <p className="text-gray-500">No homework posted yet.</p>}
  </motion.div>
)}
      
       {/* Notes Section */}
          {activeTab === 'notes' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-2xl font-bold text-primary-500 mb-6 flex items-center">
                <DocumentTextIcon className="h-8 w-8 mr-2" />
                Study Notes
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {notes.map((note, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card hover:shadow-2xl cursor-pointer group"
                  >
                    <div className="text-4xl mb-4">📝</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-primary-100 text-primary-500 px-2 py-1 rounded text-xs font-medium">
                        Class {note.class}
                      </span>
                      <span className="text-gray-400 text-xs">{note.type}</span>
                    </div>
                    <h3 className="font-semibold mb-1">{note.subject}</h3>
                    <p className="text-gray-600 text-sm">{note.topic}</p>
                    <button className="mt-4 w-full bg-primary-50 text-primary-500 py-2 rounded-lg font-medium group-hover:bg-primary-500 group-hover:text-white transition-all">
                      Download
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Results Section */}
          {activeTab === 'results' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-2xl font-bold text-primary-500 mb-6 text-center flex items-center justify-center">
                <AcademicCapIcon className="h-8 w-8 mr-2" />
                Check Your Results
              </h2>
              <div className="card">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your roll number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class *
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                      <option value="">Select Class</option>
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                        <option key={num} value={num}>Class {num}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exam Type
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                      <option>Half-Yearly Exam</option>
                      <option>Annual Exam</option>
                      <option>Unit Test</option>
                    </select>
                  </div>
                  <button className="w-full btn-primary py-3 text-lg">
                    View Result
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Downloads Section */}
          {activeTab === 'downloads' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-2xl font-bold text-primary-500 mb-6 flex items-center">
                <ArrowDownTrayIcon className="h-8 w-8 mr-2" />
                Download Materials
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {downloads.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="card flex items-center justify-between hover:bg-primary-50 cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">📄</span>
                      <div>
                        <h3 className="font-semibold text-sm">{file.name}</h3>
                        <p className="text-xs text-gray-500">{file.type} • {file.size}</p>
                      </div>
                    </div>
                    <ArrowDownTrayIcon className="h-6 w-6 text-primary-500 group-hover:scale-110 transition-transform" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Time Table Section */}
          {activeTab === 'timetable' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-2xl font-bold text-primary-500 mb-6 flex items-center">
                <ClockIcon className="h-8 w-8 mr-2" />
                Class Time Table
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl shadow-lg">
                  <thead>
                    <tr className="bg-primary-500 text-white">
                      <th className="py-4 px-6 text-left">Day</th>
                      <th className="py-4 px-6 text-left">Period 1</th>
                      <th className="py-4 px-6 text-left">Period 2</th>
                      <th className="py-4 px-6 text-left">Period 3</th>
                      <th className="py-4 px-6 text-left">Period 4</th>
                      <th className="py-4 px-6 text-left">Period 5</th>
                      <th className="py-4 px-6 text-left">Period 6</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetable.map((day, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6 font-semibold">{day.day}</td>
                        {day.periods.map((period, i) => (
                          <td key={i} className="py-4 px-6">{period}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
            }
