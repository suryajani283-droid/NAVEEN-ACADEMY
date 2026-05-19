'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SignJWT } from 'jose';
import {
  BellIcon,
  CalendarIcon,
  AcademicCapIcon,
  TrophyIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/outline'

const tabs = ['All', 'Academic', 'Events', 'Exams', 'Holidays', 'Results']

const iconMap = {
  Academic: AcademicCapIcon,
  Events: TrophyIcon,
  Exams: AcademicCapIcon,
  Holidays: CalendarIcon,
  Results: TrophyIcon,
  default: BellIcon,
}

export default function NoticesPage() {
  const [notices, setNotices] = useState([])
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    const fetchNotices = async () => {
      const { data } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false })
      setNotices(data || [])
    }
    fetchNotices()
  }, [])

  const filtered =
    activeTab === 'All'
      ? notices
      : notices.filter((n) => n.category === activeTab)

  return (
    <div className="pt-20">
      {/* Hero Section – same as before */}
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
            {tabs.map((tab) => (
              <button
                key={tab}
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
            {filtered.map((notice) => {
              const Icon = iconMap[notice.category] || iconMap.default
              return (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card hover:shadow-2xl transition-all border-l-4 border-primary-500"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-primary-100 p-3 rounded-lg">
                        <Icon className="h-8 w-8 text-primary-500" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {notice.title}
                        </h3>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 md:mt-0 ${
                            notice.type === 'Urgent'
                              ? 'bg-red-100 text-red-600'
                              : notice.type === 'Important'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-600'
                          }`}
                        >
                          {notice.type}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{notice.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {new Date(notice.date).toLocaleDateString('en-IN')}
                        </span>
                        <span className="text-sm text-primary-500 font-medium">
                          {notice.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
            {filtered.length === 0 && (
              <p className="text-center text-gray-500">No notices found.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
