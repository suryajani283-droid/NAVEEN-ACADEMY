'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Academics', href: '/academics' },
  { name: 'Faculty', href: '/faculty' },
  { name: 'Student Corner', href: '/student-corner', color: true },
  { name: 'Parent Corner', href: '/parent-corner', color: true },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Admission', href: '/admission' },
  { name: 'Notices', href: '/notices' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const [studentName, setStudentName] = useState('')
  const [isTeacher, setIsTeacher] = useState(false)
  const [teacherName, setTeacherName] = useState('')
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
        if (profile?.full_name) setStudentName(profile.full_name)

        const { data: teacher } = await supabase
          .from('teachers')
          .select('name')
          .eq('id', user.id)
          .single()
        if (teacher) {
          setIsTeacher(true)
          setTeacherName(teacher.name)
        }
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setStudentName('')
    setIsTeacher(false)
    setTeacherName('')
    router.push('/')
  }

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95'}`}>
      <nav className="container mx-auto px-2 sm:px-4 lg:px-6" aria-label="Global">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo + Name */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <img src="/images/logo.png" alt="Logo" className="h-10 lg:h-12 w-auto" />
            <div className="hidden sm:block">
              <span className="text-base lg:text-xl font-bold text-[#8B3A3A]">Naveen Academy</span>
              <p className="text-[10px] lg:text-xs text-[#B4542C] font-medium">Sr. Sec. School, Chohtan</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-2 py-1.5 text-xs xl:text-sm font-medium rounded transition-colors whitespace-nowrap ${
                  item.color
                    ? 'text-[#A52A2A] hover:text-[#8B3A3A] hover:bg-red-50'
                    : 'text-gray-700 hover:text-[#B4542C] hover:bg-orange-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {isTeacher ? (
              <Link href="/teacher/dashboard" className="text-xs xl:text-sm font-medium text-[#B4542C] hover:text-[#8B3A3A] whitespace-nowrap">
                👨‍🏫 {teacherName}
              </Link>
            ) : (
              <Link href="/teacher-login" className="text-xs xl:text-sm font-medium text-gray-500 hover:text-[#B4542C] whitespace-nowrap">
                Teacher Login
              </Link>
            )}

            {user && !isTeacher ? (
              <>
                <span className="text-xs xl:text-sm text-gray-700 whitespace-nowrap">{studentName || 'Student'}</span>
                <button onClick={handleLogout} className="text-xs xl:text-sm text-red-400 hover:text-red-300 whitespace-nowrap">Logout</button>
              </>
            ) : !user && !isTeacher ? (
              <Link href="/login" className="text-xs xl:text-sm font-semibold text-gray-700 hover:text-[#B4542C] whitespace-nowrap">Login</Link>
            ) : null}

            <Link href="/admission" className="ml-1 bg-[#B4542C] hover:bg-[#8B3A3A] text-white px-3 py-1.5 rounded-full text-xs xl:text-sm font-semibold shadow-md whitespace-nowrap">
              Admission 2026-27
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden mr-1">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 animate-pulse"
              onClick={() => setMobileMenuOpen(true)}
              style={{ animationDuration: '2s' }}
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-xl font-bold text-[#8B3A3A]">Naveen Academy</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="-m-2.5 rounded-md p-2.5 text-gray-600">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-200">
              <div className="space-y-1 py-6">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}
                    className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold ${
                      item.color
                        ? 'text-[#A52A2A] hover:bg-red-50'
                        : 'text-gray-700 hover:bg-orange-50'
                    }`}>
                    {item.name}
                  </Link>
                ))}
                <Link href={isTeacher ? '/teacher/dashboard' : '/teacher-login'} onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-[#B4542C] hover:bg-orange-50">
                  {isTeacher ? `👨‍🏫 ${teacherName}` : 'Teacher Login'}
                </Link>
              </div>
              <div className="py-6 space-y-2">
                {user ? (
                  <>
                    <p className="text-sm text-gray-500 text-center">{isTeacher ? teacherName : studentName || 'Student'}</p>
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="block w-full text-center text-red-400 hover:text-red-300 py-2">Logout</button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                    className="block text-center text-gray-700 hover:text-[#B4542C] py-2">Login</Link>
                )}
                <Link href="/admission" onClick={() => setMobileMenuOpen(false)}
                  className="bg-[#B4542C] hover:bg-[#8B3A3A] text-white block text-center w-full rounded-full px-3 py-2.5 font-semibold">
                  Admission Open 2026-27
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}