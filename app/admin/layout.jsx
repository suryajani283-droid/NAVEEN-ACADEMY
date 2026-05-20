'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  HomeIcon, ChartBarIcon, AcademicCapIcon, UserGroupIcon,
  BellAlertIcon, CameraIcon, Bars3Icon, XMarkIcon,
  ChevronDownIcon, BookOpenIcon, DocumentTextIcon,
  ArrowDownTrayIcon, TrophyIcon, ClockIcon,
  CalendarDaysIcon, ChatBubbleLeftRightIcon, PhoneIcon,
  TagIcon, ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

const sidebarSections = [
  {
    id: 'home',
    label: 'Home',
    icon: HomeIcon,
    links: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
      { href: '/admin/statistics', label: 'Statistics', icon: ChartBarIcon },
    ],
  },
  {
    id: 'student',
    label: 'Student Management',
    icon: AcademicCapIcon,
    links: [
      { href: '/admin/homework', label: 'Homework', icon: BookOpenIcon },
      { href: '/admin/notes', label: 'Notes', icon: DocumentTextIcon },
      { href: '/admin/downloads', label: 'Downloads', icon: ArrowDownTrayIcon },
      { href: '/admin/results', label: 'Results', icon: TrophyIcon },
      { href: '/admin/timetable', label: 'Timetable', icon: ClockIcon },
    ],
  },
  {
    id: 'parent',
    label: 'Parent Management',
    icon: UserGroupIcon,
    links: [
      { href: '/admin/parent-circulars', label: 'Parent Circulars', icon: TagIcon },
      { href: '/admin/ptm', label: 'PTM', icon: CalendarDaysIcon },
      { href: '/admin/feedback', label: 'Feedback', icon: ChatBubbleLeftRightIcon },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: BellAlertIcon,
    links: [
      { href: '/admin/notices', label: 'Notices', icon: BellAlertIcon },
      { href: '/admin/contacts', label: 'Contact Queries', icon: PhoneIcon },
      { href: '/admin/admission', label: 'Admissions', icon: AcademicCapIcon },
    ],
  },
  {
    id: 'content',
    label: 'Content Management',
    icon: CameraIcon,
    links: [
      { href: '/admin/gallery', label: 'Gallery', icon: CameraIcon },
      { href: '/admin/faculty', label: 'Faculty', icon: UserGroupIcon },
      { href: '/admin/advertisement', label: 'Advertisements', icon: TagIcon },
      { href: '/admin/homepage', label: 'Homepage', icon: DocumentTextIcon },
    ],
  },
]

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState(['home'])
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    for (const section of sidebarSections) {
      if (section.links.some(link => pathname.startsWith(link.href))) {
        setExpandedSections(prev =>
          prev.includes(section.id) ? prev : [...prev, section.id]
        )
        break
      }
    }
  }, [pathname])

  const toggleSection = (sectionId) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleLogout = () => {
    document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    router.push('/admin')
  }

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/')

  return (
    <div className="min-h-screen">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-20 left-0 z-40 h-[calc(100vh-5rem)] w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } overflow-y-auto flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <Link href="/admin/dashboard" className="text-lg font-bold text-orange-400">
            Admin Panel
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-3 space-y-1 flex-1">
          {sidebarSections.map((section) => (
            <div key={section.id}>
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <section.icon className="h-5 w-5" />
                  <span>{section.label}</span>
                </div>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${
                  expandedSections.includes(section.id) ? 'rotate-180' : ''
                }`} />
              </button>

              {expandedSections.includes(section.id) && (
                <div className="ml-2 mt-1 space-y-1">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive(link.href)
                          ? 'bg-orange-500/20 text-orange-400 font-medium'
                          : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <link.icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        <div className="lg:hidden fixed top-20 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <Bars3Icon className="h-6 w-6" />
          </button>
          <span className="font-semibold text-gray-700">Admin Panel</span>
        </div>
        <div className="lg:pt-0 pt-12">
          {children}
        </div>
      </div>
    </div>
  )
}