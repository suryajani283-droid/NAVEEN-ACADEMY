import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '../../../lib/supabase'
import {
  BellAlertIcon, AcademicCapIcon, PhoneIcon, BookOpenIcon,
  DocumentTextIcon, ArrowDownTrayIcon, TrophyIcon, UserGroupIcon,
  CalendarDaysIcon, ChatBubbleLeftRightIcon, CameraIcon, TagIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const statsConfig = [
  { key: 'notices', table: 'notices', label: 'Notices', icon: BellAlertIcon, color: 'bg-amber-50 text-amber-600' },
  { key: 'admissions', table: 'admissions', label: 'Admissions', icon: AcademicCapIcon, color: 'bg-emerald-50 text-emerald-600' },
  { key: 'contacts', table: 'contact_queries', label: 'Contact Queries', icon: PhoneIcon, color: 'bg-blue-50 text-blue-600' },
  { key: 'homework', table: 'homework', label: 'Homework', icon: BookOpenIcon, color: 'bg-orange-50 text-orange-600' },
  { key: 'notes', table: 'notes', label: 'Notes', icon: DocumentTextIcon, color: 'bg-violet-50 text-violet-600' },
  { key: 'downloads', table: 'downloads', label: 'Downloads', icon: ArrowDownTrayIcon, color: 'bg-rose-50 text-rose-600' },
  { key: 'results', table: 'results', label: 'Results', icon: TrophyIcon, color: 'bg-yellow-50 text-yellow-600' },
  { key: 'faculty', table: 'faculty', label: 'Faculty', icon: UserGroupIcon, color: 'bg-lime-50 text-lime-600' },
  { key: 'parentCirculars', table: 'parent_circulars', label: 'Parent Circulars', icon: TagIcon, color: 'bg-indigo-50 text-indigo-600' },
  { key: 'ptm', table: 'ptm_announcements', label: 'PTM', icon: CalendarDaysIcon, color: 'bg-teal-50 text-teal-600' },
  { key: 'feedback', table: 'feedback', label: 'Feedback', icon: ChatBubbleLeftRightIcon, color: 'bg-pink-50 text-pink-600' },
  { key: 'advertisements', table: 'advertisements', label: 'Advertisements', icon: CameraIcon, color: 'bg-fuchsia-50 text-fuchsia-600' },
  { key: 'gallery', table: 'gallery_items', label: 'Gallery', icon: CameraIcon, color: 'bg-purple-50 text-purple-600' },
  { key: 'timetables', table: 'timetables', label: 'Timetables', icon: ClockIcon, color: 'bg-cyan-50 text-cyan-600' },
]

export default async function StatisticsPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('adminToken')
  if (!token) redirect('/admin')

  const counts = {}
  for (const { key, table } of statsConfig) {
    try {
      const { count, error } = await supabaseAdmin
        .from(table)
        .select('*', { count: 'exact', head: true })
      if (!error) counts[key] = count ?? 0
    } catch {
      counts[key] = 0
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-2">Statistics Overview</h2>
      <p className="text-gray-500 mb-8">Live counts from all sections</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {statsConfig.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="card bg-white border border-slate-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-3xl font-bold text-slate-800">{counts[key] ?? '—'}</p>
              </div>
              <div className={`p-3 rounded-full ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}