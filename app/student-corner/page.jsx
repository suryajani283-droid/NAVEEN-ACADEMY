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
  const [showNotes, setShowNotes] = useState(false)    // ⬅ नया state

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

  const classList = useMemo(() => {
    const classes = [...new Set(notes.map((n) => n.class).filter(Boolean))]
    return classes.sort((a, b) => a - b)
  }, [notes])

  const subjectList = useMemo(() => {
    if (!selectedClass) return []
    const filtered = notes.filter((n) => n.class === Number(selectedClass))
    return [...new Set(filtered.map((n) => n.subject))]
  }, [notes, selectedClass])

  const filteredNotes = useMemo(() => {
    if (!showNotes) return []              // ⬅ बटन दबाने से पहले खाली
    let result = notes
    if (selectedClass) {
      result = result.filter((n) => n.class === Number(selectedClass))
    }
    if (selectedSubject) {
      result = result.filter((n) => n.subject === selectedSubject)
    }
    return result
  }, [notes, selectedClass, selectedSubject, showNotes])

  const handleSubmit = () => {
    if (!selectedClass || !selectedSubject) {
      alert('Please select both Class and Subject')
      return
    }
    setShowNotes(true)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 flex items-center">
        <DocumentTextIcon className="h-8 w-8 mr-2" />
        Study Notes
      </h2>

      {/* Filters + Submit Button */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value)
                setSelectedSubject('')
                setShowNotes(false)          // नई क्लास चुनने पर छिपाएँ
              }}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">-- Choose Class --</option>
              {classList.map((cls) => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value)
                setShowNotes(false)          // नया सब्जेक्ट चुनने पर छिपाएँ
              }}
              disabled={!selectedClass}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">-- Choose Subject --</option>
              {subjectList.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!selectedClass || !selectedSubject}
          className="btn-primary w-full md:w-auto"
        >
          Show Notes
        </button>
      </div>

      {/* Notes Display – केवल तब जब बटन दबाया हो */}
      {showNotes && (
        <>
          {filteredNotes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No notes found for {selectedSubject} (Class {selectedClass}).</p>
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
        </>
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

          {activeTab === 'downloads' && <DownloadsSection />}
       function DownloadsSection() {
  const [downloads, setDownloads] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const fetchDownloads = async () => {
      const { data } = await supabase
        .from('downloads')
        .select('*')
        .order('created_at', { ascending: false })
      setDownloads(data || [])
    }
    fetchDownloads()
  }, [])

  const categories = ['All', 'Syllabus', 'Prospectus', 'Forms', 'Timetable', 'General', 'Other']
  const filtered = selectedCategory === 'All' ? downloads : downloads.filter(d => d.category === selectedCategory)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 flex items-center">
        <ArrowDownTrayIcon className="h-8 w-8 mr-2" />
        Downloads
      </h2>

      {/* Category Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm border transition ${
                selectedCategory === cat
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-primary-500 border-primary-300 hover:bg-primary-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Downloads List */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No downloads found for this category.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.category} | {item.type}</p>
              </div>
              <a
                href={item.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm px-4 py-2"
              >
                Download
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
         }

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
