import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  PhoneIcon,
  TrophyIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  BellAlertIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const cookieStore = cookies()
  const token = cookieStore.get('adminToken')
  if (!token) redirect('/admin')

  const sections = [
    { href: '/admin/contacts', label: 'Contact Queries', icon: PhoneIcon, color: 'bg-blue-50 text-blue-600' },
    { href: '/admin/admissions', label: 'Admissions', icon: AcademicCapIcon, color: 'bg-emerald-50 text-emerald-600' },
    { href: '/admin/gallery', label: 'Gallery', icon: CameraIcon, color: 'bg-purple-50 text-purple-600' },
    { href: '/admin/notices', label: 'Notices', icon: BellAlertIcon, color: 'bg-amber-50 text-amber-600' },
    { href: '/admin/homework', label: 'Homework', icon: BookOpenIcon, color: 'bg-orange-50 text-orange-600' },
    { href: '/admin/notes', label: 'Notes', icon: DocumentTextIcon, color: 'bg-violet-50 text-violet-600' },
    { href: '/admin/downloads', label: 'Downloads', icon: ArrowDownTrayIcon, color: 'bg-rose-50 text-rose-600' },
    { href: '/admin/results', label: 'Results', icon: TrophyIcon, color: 'bg-yellow-50 text-yellow-600' },
    { href: '/admin/timetable', label: 'Timetable', icon: ClockIcon, color: 'bg-cyan-50 text-cyan-600' },
    { href: '/admin/parent-circulars', label: 'Parent Circulars', icon: UserGroupIcon, color: 'bg-indigo-50 text-indigo-600' },
    { href: '/admin/ptm', label: 'PTM', icon: CalendarDaysIcon, color: 'bg-teal-50 text-teal-600' },
    { href: '/admin/feedback', label: 'Feedback', icon: ChatBubbleLeftRightIcon, color: 'bg-pink-50 text-pink-600' },
  ]

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Admin Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="card hover:shadow-2xl transition-all duration-300 group flex flex-col items-center text-center"
          >
            <div className={`p-4 rounded-full ${section.color} group-hover:scale-110 transition-transform`}>
              <section.icon className="h-8 w-8" />
            </div>
            <h3 className="mt-4 font-semibold text-gray-700 group-hover:text-primary-500 transition-colors">
              {section.label}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  )
}
