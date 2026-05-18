'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BellIcon, 
  CalendarIcon, 
  AcademicCapIcon, 
  TrophyIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline'

export default function NoticesPage() {
  const [activeTab, setActiveTab] = useState('All')

  const tabs = ['All', 'Academic', 'Events', 'Exams', 'Holidays', 'Results']

  const notices = [
    {
      title: 'Admission Open for Session 2024-25',
      date: '2024-03-15',
      category: 'Academic',
      type: 'Important',
      description: 'Admissions are now open for classes Nursery to XII. Parents are requested to visit the school office for registration.',
      icon: AcademicCapIcon
    },
    {
      title: 'Annual Sports Day - 20th March 2024',
      date: '2024-03-10',
      category: 'Events',
      type: 'Event',
      description: 'Annual Sports Day will be held on 20th March 2024. All students must participate. Parents are cordially invited.',
      icon: TrophyIcon
    },
    {
      title: 'Half-Yearly Examination Schedule',
      date: '2024-03-05',
      category: 'Exams',
      type: 'Urgent',
      description: 'Half-yearly examinations for classes VI to XII will begin from 5th April 2024. Detailed time table has been shared.',
      icon: AcademicCapIcon
    },
    {
      title: 'Summer Vacation Dates Announced',
      date: '2024-03-01',
      category: 'Holidays',
      type: 'Notice',
      description: 'Summer vacation will be from 15th May 2024 to 30th June 2024. School reopens on 1st July 2024.',
      icon: CalendarIcon
    },
    {
      title: 'PTM Schedule - March 2024',
      date: '2024-02-28',
      category: 'Academic',
      type: 'Important',
      description: 'Parent Teacher Meeting for all classes will be held on 25th March 2024 from 9:00 AM to 2:00 PM.',
      icon: SpeakerWaveIcon
    },
    {
      title: 'Board Exam Results - Class X & XII',
      date: '2024-02-20',
      category: 'Results',
      type: 'Important',
      description: 'CBSE Board exam results for Class X and XII will be declared soon. Students can check results online.',
      icon: TrophyIcon
    },
    {
      title: 'Republic Day Celebration',
      date: '2024-01-25',
      category: 'Events',
      type: 'Event',
      description: 'Republic Day celebration will be held on 26th January. Flag hoisting at 8:00 AM. All students must attend.',
      icon: BellIcon
    },
    {
      title: 'Winter Holiday Homework Submission',
      date: '2024-01-10',
      category: 'Academic',
      type: 'Notice',
      description: 'Last date for winter holiday homework submission is 15th January 2024. Submit to respective class teachers.',
      icon: AcademicCapIcon
    }
  ]

  const filteredNotices = activeTab === 'All' 
    ? notices 
    : notices.filter(notice => notice.category === activeTab)

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
            Notices & Announcements
          </motion.h1>
          <p className="text-xl">Stay Updated with Latest School Information</p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-white shadow-md sticky top-20 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-primary-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Notices List */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-6">
            {filteredNotices.map((notice, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card hover:shadow-2xl transition-all border-l-4 border-primary-500"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <notice.icon className="h-8 w-8 text-primary-500" />
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{notice.title}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 md:mt-0 ${
                        notice.type === 'Urgent' 
                          ? 'bg-red-100 text-red-600'
                          : notice.type === 'Important'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {notice.type}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{notice.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(notice.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="text-sm text-primary-500 font-medium">
                        {notice.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-500 mb-8">Downloads</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { title: 'Academic Calendar', format: 'PDF', size: '2.5 MB' },
              { title: 'School Prospectus', format: 'PDF', size: '5.1 MB' },
              { title: 'Fee Structure 2024-25', format: 'PDF', size: '1.2 MB' }
            ].map((download, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card hover:bg-primary-50 cursor-pointer"
              >
                <div className="text-4xl mb-3">📄</div>
                <h3 className="font-semibold mb-1">{download.title}</h3>
                <p className="text-sm text-gray-500">{download.format} • {download.size}</p>
                <button className="mt-3 text-primary-500 font-medium hover:text-primary-600">
                  Download ↓
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
