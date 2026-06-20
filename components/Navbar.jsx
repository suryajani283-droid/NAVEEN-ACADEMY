'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { createClient } from '@supabase/supabase-js'
import { useLanguage } from './LanguageProvider'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Navbar() {
  const { t } = useLanguage()
  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('about'), href: '/about' },
    { name: t('academics'), href: '/academics' },
    { name: t('faculty'), href: '/faculty' },
    { name: t('studentCorner'), href: '/student-corner', color: true },
    { name: t('parentCorner'), href: '/parent-corner', color: true },
    { name: t('gallery'), href: '/gallery' },
    { name: t('admission'), href: '/admissions' },
    { name: t('notices'), href: '/notices' },
  ]

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
    <header className={`fixed top-10 w-full z-[1000] transition-all duration-300 ${scrolled ? 'bg-white shadow-lg dark:bg-gray-800 dark:shadow-gray-700' : 'bg-white/95 dark:bg-gray-800/95'}`}>
      <nav className="container mx-auto px-2 sm:px-4 lg:px-6" aria-label="Global">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <img src="/images/logo.png" alt="Logo" className="h-10 lg:h-12 w-auto" />
            <div>
              <span className="text-base lg:text-xl font-bold text-[#8B3A3A] dark:text-[#D98C8C]">{t('navTitle')}</span>
              <p className="text-[10px] lg:text-xs text-[#B4542C] dark:text-[#E0966A] font-medium">{t('navSubtitle')}</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-2 py-1.5 text-xs xl:text-sm font-medium rounded transition-colors whitespace-nowrap ${
                  item.color
                    ? 'text-[#A52A2A] hover:text-[#8B3A3A] hover:bg-red-50 dark:text-[#D98C8C] dark:hover:text-red-300 dark:hover:bg-red-900'
                    : 'text-gray-700 hover:text-[#B4542C] hover:bg-orange-50 dark:text-gray-300 dark:hover:text-orange-300 dark:hover:bg-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/settings" className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-[#B4542C] transition-colors" title={t('settings')}>
              <Cog6ToothIcon className="h-5 w-5" />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {user && !isTeacher ? (
              <>
                <span className="text-xs xl:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{studentName || 'Student'}</span>
                <button onClick={handleLogout} className="text-xs xl:text-sm text-red-400 hover:text-red-300 dark:text-red-300 dark:hover:text-red-200 whitespace-nowrap">{t('logout')}</button>
              </>
            ) : !user && !isTeacher ? (
              <Link href="/login" className="text-xs xl:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-[#B4542C] dark:hover:text-orange-300 whitespace-nowrap">{t('login')}</Link>
            ) : null}
          </div>

          <div className="flex lg:hidden mr-1">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-600 dark:text-gray-300 animate-pulse"
              onClick={() => setMobileMenuOpen(true)}
              style={{ animationDuration: '2s' }}
            >
              <Bars3Icon className="h-8 w-8" />
            </button>
          </div>
        </div>
      </nav>

      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-900 px-6 py-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-xl font-bold text-[#8B3A3A] dark:text-[#D98C8C]">{t('navTitle')}</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="-m-2.5 rounded-md p-2.5 text-gray-600 dark:text-gray-300">
              <XMarkIcon className="h-7 w-7" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
              <div className="space-y-1 py-6">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}
                    className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold ${
                      item.color
                        ? 'text-[#A52A2A] hover:bg-red-50 dark:text-[#D98C8C] dark:hover:bg-red-900'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700'
                    }`}>
                    {item.name}
                  </Link>
                ))}
                <Link href="/settings" onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 flex items-center gap-2">
                  <Cog6ToothIcon className="h-5 w-5" />
                  {t('settings')}
                </Link>
              </div>
              <div className="py-6 space-y-2">
                {user ? (
                  <>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{isTeacher ? teacherName : studentName || 'Student'}</p>
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="block w-full text-center text-red-400 hover:text-red-300 dark:text-red-300 dark:hover:text-red-200 py-2">{t('logout')}</button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                    className="block text-center text-gray-700 dark:text-gray-300 hover:text-[#B4542C] dark:hover:text-orange-300 py-2">{t('login')}</Link>
                )}
                <Link href="/admissions" onClick={() => setMobileMenuOpen(false)}
                  className="bg-[#B4542C] hover:bg-[#8B3A3A] text-white block text-center w-full rounded-full px-3 py-2.5 font-semibold">
                  {t('admissionOpen')}
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}