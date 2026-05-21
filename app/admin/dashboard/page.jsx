import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function Dashboard() {
  const cookieStore = cookies()
  const token = cookieStore.get('adminToken')
  if (!token) redirect('/admin')

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-2">Welcome to Admin Panel</h2>
      <p className="text-gray-500 mb-8">Manage your school website from here</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/statistics" className="card bg-white border border-slate-100 shadow-md hover:shadow-lg transition p-6 text-center">
          <span className="text-4xl">📈</span>
          <h3 className="font-semibold mt-3 text-gray-700">View Statistics</h3>
          <p className="text-sm text-gray-500 mt-1">Check all data counts</p>
        </Link>
        <Link href="/admin/notices" className="card bg-white border border-slate-100 shadow-md hover:shadow-lg transition p-6 text-center">
          <span className="text-4xl">📢</span>
          <h3 className="font-semibold mt-3 text-gray-700">Post Notice</h3>
          <p className="text-sm text-gray-500 mt-1">Add new announcements</p>
        </Link>
        <Link href="/admin/admissions" className="card bg-white border border-slate-100 shadow-md hover:shadow-lg transition p-6 text-center">
          <span className="text-4xl">🎓</span>
          <h3 className="font-semibold mt-3 text-gray-700">Admissions</h3>
          <p className="text-sm text-gray-500 mt-1">View applications</p>
        </Link>
      </div>
    </div>
  )
}