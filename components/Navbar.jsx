'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Dialog, Transition } from '@headlessui/react'
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
          {/* Logo + Name */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <img src="/images/logo.png" alt="Logo" className="h-10 lg:h-12 w-auto" />
            <div>
              <span className="text-base lg:text-xl font-bold text-[#8B3A3A] dark:text-[#D98C8C]">{t('navTitle')}</span>
              <p className="text-[10px] lg:text-xs text-[#B4542C] dark:text-[#E0966A] font-medium">{t('navSubtitle')}</p>
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

          {/* Auth Section – Desktop */}
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

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden ml-auto">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-600 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-7 w-7" />
            </button>
          </div>
        </div>
      </nav>

      {/* ---------------------------------------- */}
      /* 🍊 MOBILE SIDE PANEL – Transparent site colors, no blur */
      /* ---------------------------------------- */}
      <Transition show={mobileMenuOpen} as="div">
        <Dialog as="div" className="relative z-[2000]" onClose={setMobileMenuOpen}>
          {/* Light backdrop – no blur */}
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-0 bg-black/30"
          />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed top-24 right-0 flex max-w-full">
                <Transition.Child
                  as="div"
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                  className="pointer-events-auto w-screen max-w-sm"
                >
                  <Dialog.Panel className="flex h-full flex-col overflow-y-auto bg-[#B4542C]/85 dark:bg-[#8B3A3A]/85 backdrop-blur-none shadow-2xl rounded-l-2xl border-l border-white/20">
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-semibold text-white">
                          Naveen Academy
                        </Dialog.Title>
                        <button
                          type="button"
                          className="rounded-md text-white/80 hover:text-white focus:outline-none"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    <div className="px-4 sm:px-6 flex-1">
                      <div className="space-y-1 text-right">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block rounded-lg px-4 py-3 text-base font-semibold transition-colors ${
                              item.color
                                ? 'text-white hover:bg-white/20'
                                : 'text-white hover:bg-white/10'
                            }`}
                          >
                            {item.name}
                          </Link>
                        ))}
                        <Link
                          href="/settings"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-end gap-2 rounded-lg px-4 py-3 text-base font-semibold text-white hover:bg-white/10"
                        >
                          {t('settings')}
                          <Cog6ToothIcon className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>

                    {/* Auth section */}
                    <div className="px-4 sm:px-6 py-4 border-t border-white/20">
                      {user ? (
                        <div className="space-y-3">
                          <p className="text-center text-sm text-white/80">
                            {isTeacher ? teacherName : studentName || 'Student'}
                          </p>
                          <button
                            onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                            className="block w-full text-center py-2 text-red-200 hover:text-red-100"
                          >
                            {t('logout')}
                          </button>
                        </div>
                      ) : (
                        <Link
                          href="/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-center py-2 text-white hover:text-white/80"
                        >
                          {t('login')}
                        </Link>
                      )}
                      <Link
                        href="/admissions"
                        onClick={() => setMobileMenuOpen(false)}
                        className="mt-3 block w-full text-center bg-white text-[#B4542C] hover:bg-gray-100 font-semibold rounded-full px-4 py-2.5"
                      >
                        {t('admissionOpen')}
                      </Link>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </header>
  )
}