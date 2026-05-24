'use client'
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import {
  BookOpenIcon,
  DocumentTextIcon,
  ClockIcon,
  AcademicCapIcon,
  ArrowDownTrayIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/outline'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const tabs = [
  { id: 'homework', name: 'Homework', icon: BookOpenIcon },
  { id: 'notes', name: 'Notes', icon: DocumentTextIcon },
  { id: 'video', name: 'Video Lectures', icon: PlayCircleIcon },
  { id: 'results', name: 'Results', icon: AcademicCapIcon },
  { id: 'downloads', name: 'Downloads', icon: ArrowDownTrayIcon },
  { id: 'timetable', name: 'Time Table', icon: ClockIcon },
]

// Helper: Extract YouTube Video ID from any format
function getYouTubeVideoId(url) {
  if (!url) return null
  if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url
  const shortMatch = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/)
  if (shortMatch) return shortMatch[1]
  const longMatch = url.match(/[?&]v=([A-Za-z0-9_-]{11})/)
  if (longMatch) return longMatch[1]
  const embedMatch = url.match(/embed\/([A-Za-z0-9_-]{11})/)
  if (embedMatch) return embedMatch[1]
  return null
}

// ==================== HOMEWORK SECTION ====================
function HomeworkSection({ studentClass }) {
  const [homeworks, setHomeworks] = useState([])
  const [selectedClass, setSelectedClass] = useState(studentClass || '')
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [showSubjects, setShowSubjects] = useState(false)
  const [showHomework, setShowHomework] = useState(false)

  useEffect(() => {
    const fetchHomeworks = async () => {
      const { data } = await supabase
        .from('homework')
        .select('*')
        .order('created_at', { ascending: false })
      setHomeworks(data || [])
    }
    fetchHomeworks()
  }, [])

  const classList = useMemo(() => {
    const classes = [...new Set(homeworks.map((h) => h.class).filter(Boolean))]
    return classes.sort((a, b) => a - b)
  }, [homeworks])

  const handleClassSubmit = () => {
    if (!selectedClass) return
    const filtered = homeworks.filter((h) => h.class === Number(selectedClass))
    const uniqueSubjects = [...new Set(filtered.map((h) => h.subject))]
    setSubjects(uniqueSubjects)
    setSelectedSubject('')
    setShowSubjects(true)
    setShowHomework(false)
  }

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject)
    setShowHomework(true)
  }

  const filteredHomeworks = useMemo(() => {
    if (!selectedClass || !selectedSubject || !showHomework) return []
    return homeworks.filter(
      (h) => h.class === Number(selectedClass) && h.subject === selectedSubject
    )
  }, [homeworks, selectedClass, selectedSubject, showHomework])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 flex items-center">
        <BookOpenIcon className="h-8 w-8 mr-2" />
        Daily Homework
      </h2>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value)
                setShowSubjects(false)
                setShowHomework(false)
              }}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">-- Choose Class --</option>
              {classList.map((cls) => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
          </div>
          <button onClick={handleClassSubmit} disabled={!selectedClass} className="btn-primary whitespace-nowrap">
            Show Subjects
          </button>
        </div>
      </div>

      {showSubjects && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-3">Subjects for Class {selectedClass}</h3>
          {subjects.length === 0 ? (
            <p className="text-gray-500">No homework found for this class.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {subjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleSubjectClick(sub)}
                  className={`px-4 py-2 rounded-full border transition ${
                    selectedSubject === sub
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-primary-500 border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {showHomework && selectedSubject && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-primary-500">
            {selectedSubject} - Class {selectedClass}
          </h3>
          {filteredHomeworks.length === 0 ? (
            <p className="text-gray-500">No homework for this subject.</p>
          ) : (
            filteredHomeworks.map((hw) => (
              <motion.div
                key={hw.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card"
              >
                <h4 className="font-semibold text-lg">{hw.topic || 'No Topic'}</h4>
                {hw.description && <p className="text-gray-600 mt-1">{hw.description}</p>}
                {hw.due_date && (
                  <p className="text-xs text-gray-400 mt-2">
                    📅 Due: {new Date(hw.due_date).toLocaleDateString('en-IN')}
                  </p>
                )}
                {hw.file_url && (
                  <a
                    href={hw.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 bg-primary-50 text-primary-500 px-4 py-2 rounded-lg font-medium hover:bg-primary-500 hover:text-white transition"
                  >
                    {hw.type === 'PDF' ? '📄 Open PDF' : '🖼️ View Image'}
                  </a>
                )}
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.div>
  )
}

// ==================== NOTES SECTION ====================
function NotesSection({ studentClass }) {
  const [notes, setNotes] = useState([])
  const [selectedClass, setSelectedClass] = useState(studentClass || '')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [showNotes, setShowNotes] = useState(false)

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
    if (!showNotes) return []
    let result = notes
    if (selectedClass) result = result.filter((n) => n.class === Number(selectedClass))
    if (selectedSubject) result = result.filter((n) => n.subject === selectedSubject)
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

      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value)
                setSelectedSubject('')
                setShowNotes(false)
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
                setShowNotes(false)
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
        <button onClick={handleSubmit} disabled={!selectedClass || !selectedSubject} className="btn-primary w-full md:w-auto">
          Show Notes
        </button>
      </div>

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

// ==================== VIDEO LECTURES SECTION (Fixed – no class filter) ====================
function VideoLecturesSection({ studentClass }) {
  const [lectures, setLectures] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedChapter, setSelectedChapter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLectures = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('video_lectures')
        .select('*')
        .order('created_at')
      setLectures(data || [])
      setLoading(false)
    }
    fetchLectures()
  }, [])

  const subjects = [...new Set(lectures.map(l => l.subject))]
  const chapters = selectedSubject
    ? [...new Set(lectures.filter(l => l.subject === selectedSubject).map(l => l.chapter))]
    : []

  const filtered = lectures.filter(l => {
    if (selectedSubject && l.subject !== selectedSubject) return false
    if (selectedChapter && l.chapter !== selectedChapter) return false
    return true
  })

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading lectures...</p>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 flex items-center">
        <PlayCircleIcon className="h-8 w-8 mr-2" />
        Video Lectures
      </h2>
      <div className="grid md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <select value={selectedSubject} onChange={(e) => { setSelectedSubject(e.target.value); setSelectedChapter(''); }} className="w-full px-4 py-2 border rounded">
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chapter</label>
          <select value={selectedChapter} onChange={(e) => setSelectedChapter(e.target.value)} className="w-full px-4 py-2 border rounded">
            <option value="">All Chapters</option>
            {chapters.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No video lectures found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((lec) => {
            const videoId = getYouTubeVideoId(lec.youtube_url)
            return (
              <motion.div key={lec.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
                <h3 className="font-semibold">{lec.subject} – {lec.chapter}</h3>
                <p className="text-gray-600 text-sm mb-3">{lec.title}</p>
                {videoId ? (
                  <div className="mb-3 rounded overflow-hidden aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={lec.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <p className="text-red-500 text-sm">Invalid video URL</p>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

// ==================== DOWNLOADS SECTION ====================
function DownloadsSection({ studentClass }) {
  const [downloads, setDownloads] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const fetchDownloads = async () => {
      let query = supabase.from('downloads').select('*').order('created_at', { ascending: false })
      const { data } = await query
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

// ==================== RESULTS SECTION (DOB‑based + rank) ====================
function ResultsSection() {
  const [cls, setCls] = useState('')
  const [roll, setRoll] = useState('')
  const [dob, setDob] = useState('')
  const [result, setResult] = useState(null)
  const [rank, setRank] = useState(null)
  const [error, setError] = useState('')

  const handleCheck = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setRank(null)

    const res = await fetch('/api/results/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class: cls, roll, dob }),
    })
    const data = await res.json()
    if (res.ok) {
      setResult(data.result)
      if (data.rank) setRank(data.rank)
    } else {
      setError(data.error || 'Something went wrong')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 flex items-center">
        <AcademicCapIcon className="h-8 w-8 mr-2" />
        Check Your Result
      </h2>

      <form onSubmit={handleCheck} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
          <select value={cls} onChange={(e) => setCls(e.target.value)} className="w-full px-4 py-2 border rounded" required>
            <option value="">-- Choose Class --</option>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number *</label>
          <input type="text" required value={roll} onChange={(e) => setRoll(e.target.value)}
            className="