 'use client'
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'
import {
  BookOpenIcon,
  DocumentTextIcon,
  ClockIcon,
  AcademicCapIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const tabs = [
  { id: 'homework', name: 'Homework', icon: BookOpenIcon },
  { id: 'notes', name: 'Notes', icon: DocumentTextIcon },
  { id: 'results', name: 'Results', icon: AcademicCapIcon },
  { id: 'downloads', name: 'Downloads', icon: ArrowDownTrayIcon },
  { id: 'timetable', name: 'Time Table', icon: ClockIcon },
]

// ==================== Notes Section with Class / Subject Filter ====================
function NotesSection() {
  const [notes, setNotes] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')

  // सभी नोट्स लोड करें
  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })
      setNotes(data || [])
    }
    fetchNotes()
  }, [])

  // यूनिक क्लासेज़ निकालें
  const classList = useMemo(() => {
    const classes = [...new Set(notes.map((n) => n.class).filter(Boolean))]
    return classes.sort((a, b) => a - b)
  }, [notes])

  // चुनी हुई क्लास के अनुसार सब्जेक्ट लिस्ट
  const subjectList = useMemo(() => {
    if (!selectedClass) return []
    const filtered = notes.filter((n) => n.class === Number(selectedClass))
    return [...new Set(filtered.map((n) => n.subject))]
  }, [notes, selectedClass])

  // फ़िल्टर किए गए नोट्स
  const filteredNotes = useMemo(() => {
    let result = notes
    if (selectedClass) {
      result = result.filter((n) => n.class === Number(selectedClass))
    }
    if (selectedSubject) {
      result = result.filter((n) => n.subject === selectedSubject)
    }
    return result
  }, [notes, selectedClass, selectedSubject])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 flex items-center">
        <DocumentTextIcon className="h-8 w-8 mr-2" />
        Study Notes
      </h2>

      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value)
              setSelectedSubject('')   // क्लास बदलने पर सब्जेक्ट रीसेट
            }}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">All Classes</option>
            {classList.map((cls) => (
              <option key={cls} value={cls}>Class {cls}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedClass}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">All Subjects</option>
            {subjectList.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No notes found for selected filters.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card hover:shadow-2xl transition"
            >
              <div className="text-4xl mb-4">{note.type === 'PDF' ? '📄' : '🖼️'}</div>
              <span className="bg-primary-100 text-primary-500 px-2 py-1 rounded text-xs font-medium">
                Class {note.class}
              </span>
              <h3 className="font-semibold mt-2">{note.subject}</h3>
              {note.title && <p className="text-gray-600 text-sm mt-1">{note.title}</p>}
              {note.file_url && (
                <a
                  href={note.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block w-full bg-primary-50 text-primary-500 py-2 rounded-lg font-medium text-center hover:bg-primary-500 hover:text-white transition-all"
                >
                  {note.type === 'PDF' ? 'Open PDF' : 'View Image'}
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default function StudentCornerPage() {
  const [activeTab, setActiveTab] = useState('homework')
  const [homeworkList, setHomeworkList] = useState([])
  const [notesList, setNotesList] = useState([])

  // Fetch homework
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

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })
      setNotesList(data || [])
    }
    fetchNotes()
  }, [])

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

          {/* Homework Tab */}
          {activeTab === 'homework' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-2xl font-bold text-primary-500 mb-6 flex items-center">
                <BookOpenIcon className="h-8 w-8 mr-2" />
                Daily Homework
              </h2>
              {homeworkList.length === 0 && (
                <p className="text-gray-500">No homework posted yet.</p>
              )}
              {homeworkList.map((hw) => (
                <motion.div
                  key={hw.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-primary-100 text-primary-500 px-3 py-1 rounded-full text-sm font-medium">
                        Class {hw.class}
                      </span>
                      <h3 className="text-lg font-semibold mt-2">{hw.subject}</h3>
                      {hw.topic && <p className="text-gray-600">{hw.topic}</p>}
                      {hw.description && (
                        <p className="text-gray-500 text-sm mt-1">{hw.description}</p>
                      )}
                      {hw.due_date && (
                        <p className="text-xs text-gray-400 mt-2">
                          📅 Due: {new Date(hw.due_date).toLocaleDateString('en-IN')}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Notes Tab – use the NotesSection component */}
          {activeTab === 'notes' && <NotesSection notes={notesList} />}

          {/* Results Tab (placeholder) */}
          {activeTab === 'results' && (
            <div className="text-center py-12">
              <AcademicCapIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Results will be available after exams.</p>
            </div>
          )}

          {/* Downloads Tab (placeholder) */}
          {activeTab === 'downloads' && (
            <div className="text-center py-12">
              <ArrowDownTrayIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Downloads coming soon.</p>
            </div>
          )}

          {/* Time Table Tab (placeholder) */}
          {activeTab === 'timetable' && (
            <div className="text-center py-12">
              <ClockIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Timetable will be updated soon.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
          }
