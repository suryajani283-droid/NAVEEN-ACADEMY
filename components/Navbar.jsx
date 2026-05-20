'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex items-center justify-between h-20">
          {/* Logo + School Name */}
          <div className="flex lg:flex-1">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/images/logo.png"
                alt="Naveen Academy Logo"
                className="h-12 w-auto"
              />
              <div>
                <span className={`text-xl font-bold transition-colors ${scrolled ? 'text-dark-800' : 'text-white'}`}>
                  Naveen Academy
                </span>
                <p className={`text-xs transition-colors ${scrolled ? 'text-primary-500' : 'text-primary-300'}`}>
                  Sr. Sec. School, Chohtan
                </p>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 transition-colors ${scrolled ? 'text-gray-700 hover:text-primary-500' : 'text-white hover:text-primary-300'}`}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold leading-6 transition-colors ${
                  item.color
                    ? 'text-red-600 hover:text-red-800'  // maroon for Student & Parent Corner
                    : scrolled
                      ? 'text-dark-600 hover:text-primary-500'
                      : 'text-white/80 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Admission Button (Desktop) */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link
              href="/admission"
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              Admission Open 2026-27
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dialog */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-xl font-bold text-dark-800">Naveen Academy</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:text-primary-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-200">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                      item.color
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  href="/admission"
                  className="bg-primary-500 hover:bg-primary-600 text-white block text-center w-full rounded-lg px-3 py-2.5 font-semibold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
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