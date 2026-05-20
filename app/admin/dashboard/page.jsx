import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '../../../lib/supabase'

const statsTables = [
  { key: 'notices', table: 'notices', label: 'Notices' },
  { key: 'admissions', table: 'admissions', label: 'Admissions' },
  { key: 'contacts', table: 'contact_queries', label: 'Contact Queries' },
  { key: 'homework', table: 'homework', label: 'Homework' },
  { key: 'notes', table: 'notes', label: 'Notes' },
  { key: 'downloads', table: 'downloads', label: 'Downloads' },
  { key: 'results', table: 'results', label: 'Results' },
  { key: 'faculty', table: 'faculty', label: 'Faculty' },
  { key: 'circulars', table: 'parent_circulars', label: 'Parent Circulars' },
  { key: 'ptm', table: 'ptm_announcements', label: 'PTM' },
  { key: 'feedback', table: 'feedback', label: 'Feedback' },
  { key: 'ads', table: 'advertisement', label: 'Advertisement' },
  { key: 'gallery', table: 'gallery_items', label: 'Gallery' },
]

export default async function Dashboard() {
  const cookieStore = cookies()
  const token = cookieStore.get('adminToken')
  if (!token) redirect('/admin')

  // Fetch counts for all tables
  const counts = {}
  for (const { key, table } of statsTables) {
    try {
      const { count, error } = await supabaseAdmin
        .from(table)
        .select('*', { count: 'exact', head: true })
      if (!error) counts[key] = count ?? 0
    } catch {
      counts[key] = 0
    }
  }

  const sections = [
    { href: '/admin/contacts', label: '📬 Contact Queries', color: 'bg-blue-50' },
    { href: '/admin/admission', label: '🎓 Admissions', color: 'bg-emerald-50' },
    { href: '/admin/notices', label: '📢 Notices', color: 'bg-amber-50' },
    { href: '/admin/homework', label: '📝 Homework', color: 'bg-orange-50' },
    { href: '/admin/notes', label: '📚 Notes', color: 'bg-violet-50' },
    { href: '/admin/downloads', label: '📥 Downloads', color: 'bg-rose-50' },
    { href: '/admin/results', label: '🏆 Results', color: 'bg-yellow-50' },
    { href: '/admin/timetable', label: '🕒 Timetable', color: 'bg-cyan-50' },
    { href: '/admin/homepage', label: '🏠 Homepage', color: 'bg-gray-50' },
    { href: '/admin/gallery', label: '🖼️ Gallery', color: 'bg-purple-50' },
    { href: '/admin/faculty', label: '👨‍🏫 Faculty', color: 'bg-lime-50' },
    { href: '/admin/parent-circulars', label: '📣 Parent Circulars', color: 'bg-indigo-50' },
    { href: '/admin/ptm', label: '📅 PTM', color: 'bg-teal-50' },
    { href: '/admin/feedback', label: '💬 Feedback', color: 'bg-pink-50' },
    { href: '/admin/advertisement', label: '📢 Ads', color: 'bg-fuchsia-50' },
  ]

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Admin Dashboard</h2>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
        {statsTables.map(({ key, label }) => (
          <div key={key} className="card bg-white border border-slate-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-800">{counts[key] ?? '—'}</p>
              </div>
              <div className="p-2 rounded-full bg-gray-100">
                <span className="text-xl">{sections.find(s => s.label.includes(label.split(' ')[0]))?.label?.split(' ')[0] ?? '📌'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className={`card hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center ${section.color} bg-opacity-50`}
          >
            <span className="text-4xl mb-2">{section.label.split(' ')[0]}</span>
            <h3 className="font-semibold text-gray-700">{section.label.substring(3)}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}