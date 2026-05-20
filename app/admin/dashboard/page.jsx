import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function Dashboard() {
  const cookieStore = cookies()
  const token = cookieStore.get('adminToken')
  if (!token) redirect('/admin')

  return (
    <div className="pt-20 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-8">Admin Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-6">
      
        <Link href="/admin/contacts" className="card hover:shadow-xl transition text-center">
          <span className="text-4xl">📬</span>
          <h3 className="font-semibold mt-2">Contact Queries</h3>
        </Link>
        <Link href="/admin/results" className="card hover:shadow-xl transition text-center">
  <span className="text-4xl">🏆</span>
  <h3 className="font-semibold mt-2">Results</h3>
</Link>
        <Link href="/admin/homework" className="card hover:shadow-xl transition text-center">
  <span className="text-4xl">📝</span>
  <h3 className="font-semibold mt-2">Homework</h3>
</Link>
        <Link href="/admin/notes" className="card hover:shadow-xl transition text-center">
  <span className="text-4xl">📚</span>
  <h3 className="font-semibold mt-2">Notes</h3>
</Link>
        <Link href="/admin/downloads" className="card hover:shadow-xl transition text-center">
  <span className="text-4xl">📥</span>
  <h3 className="font-semibold mt-2">Downloads</h3>
</Link>
        <Link href="/admin/notices" className="card hover:shadow-xl transition text-center">
  <span className="text-4xl">📢</span>
  <h3 className="font-semibold mt-2">Notices</h3>
</Link>
        <Link href="/admin/parent-circulars" className="card hover:shadow-xl transition text-center">
  <span className="text-4xl">📣</span>
  <h3 className="font-semibold mt-2">Parent Circulars</h3>
</Link>
<Link href="/admin/ptm" className="card hover:shadow-xl transition text-center">
  <span className="text-4xl">📅</span>
  <h3 className="font-semibold mt-2">PTM</h3>
</Link>
<Link href="/admin/feedback" className="card hover:shadow-xl transition text-center">
  <span className="text-4xl">💬</span>
  <h3 className="font-semibold mt-2">Feedback</h3>
</Link>
        <Link href="/admin/admissions" className="card hover:shadow-xl transition text-center">
  <span className="text-4xl">🎓</span>
  <h3 className="font-semibold mt-2">Admissions</h3>
</Link>
        <Link href="/admin/timetable" className="card hover:shadow-xl transition text-center">
  <span className="text-4xl">🕒</span>
  <h3 className="font-semibold mt-2">Timetable</h3>
</Link>
      </div>
    </div>
  )
}
