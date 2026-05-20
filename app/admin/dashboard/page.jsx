import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function Dashboard() {
  const cookieStore = cookies()
  const token = cookieStore.get('adminToken')
  if (!token) redirect('/admin')

  const sections = [
    { href: '/admin/contacts', label: '📬 Contact Queries', color: 'bg-blue-50' },
    { href: '/admin/admissions', label: '🎓 Admissions', color: 'bg-emerald-50' },
    { href: '/admin/notices', label: '📢 Notices', color: 'bg-amber-50' },
    { href: '/admin/homework', label: '📝 Homework', color: 'bg-orange-50' },
    { href: '/admin/notes', label: '📚 Notes', color: 'bg-violet-50' },
    { href: '/admin/downloads', label: '📥 Downloads', color: 'bg-rose-50' },
    { href: '/admin/results', label: '🏆 Results', color: 'bg-yellow-50' },
    { href: '/admin/timetable', label: '🕒 Timetable', color: 'bg-cyan-50' },
    { href: '/admin/homepage', label: '🏠 Homepage', color: 'bg-gray-50' },
    { href: '/admin/gallery', label: '🖼️ Gallery', color: 'bg-purple-50' },
    { href: '/admin/faculty', label: '👨‍🏫 Faculty', color: 'bg-lime-50 text-lime-600' },
    { href: '/admin/parent-circulars', label: '📣 Parent Circulars', color: 'bg-indigo-50' },
    { href: '/admin/ptm', label: '📅 PTM', color: 'bg-teal-50' },
    { href: '/admin/feedback', label: '💬 Feedback', color: 'bg-pink-50' },
  ]

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Admin Dashboard</h2>
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
