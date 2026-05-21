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
  { name: 'Admission', href: '/admissions' },
  { name: 'Notices', href: '/notices' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check auth state
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg' : 'bg-white/95'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Name */}
          <div className="flex lg:flex-1">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/images/logo.png" alt="Logo" className="h-12 w-auto" />
              <div>
                <span className="text-xl font-bold text-[#8B3A3A]">Naveen Academy</span>
                <p className="text-xs text-[#B4542C] font-medium">Sr. Sec. School, Chohtan</p>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-600"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Desktop links */}
          <div className="hidden lg:flex lg:gap-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                  item.color
                    ? 'text-[#A52A2A] hover:text-[#8B3A3A] hover:bg-red-50'
                    : 'text-gray-700 hover:text-[#B4542C] hover:bg-orange-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth + Admission button (desktop) */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-6">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold text-gray-700 hover:text-[#B4542C] transition-colors"
              >
                Login
              </Link>
            )}
            <Link
              href="/admission"
              className="bg-[#B4542C] hover:bg-[#8B3A3A] text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-md"
            >
              Admission Open 2026-27
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-xl font-bold text-[#8B3A3A]">Naveen Academy</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-200">
              <div className="space-y-1 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold transition-colors ${
                      item.color
                        ? 'text-[#A52A2A] hover:bg-red-50'
                        : 'text-gray-700 hover:bg-orange-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6 space-y-2">
                {user ? (
                  <>
                    <p className="text-sm text-gray-500 text-center">{user.email}</p>
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="block w-full text-center text-red-400 hover:text-red-300 transition-colors py-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center text-gray-700 hover:text-[#B4542C] transition-colors py-2"
                  >
                    Login
                  </Link>
                )}
                <Link
                  href="/admission"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-[#B4542C] hover:bg-[#8B3A3A] text-white block text-center w-full rounded-full px-3 py-2.5 font-semibold transition-colors shadow-md"
                >
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