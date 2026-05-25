'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import {
  HomeIcon, AcademicCapIcon, CameraIcon, BellAlertIcon, PhoneIcon,
  PlayCircleIcon, BookOpenIcon, DocumentTextIcon, Bars3Icon,
  UserCircleIcon, ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function MobileBottomNav() {
  const [user, setUser] = useState(null)
  const [userName, setUserName] = useState('')
  const [isTeacher, setIsTeacher] = useState(false)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        // Student profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
        if (profile?.full_name) setUserName(profile.full_name)

        // Teacher check
        const { data: teacher } = await supabase
          .from('teachers')
          .select('name')
          .eq('id', user.id)
          .single()
        setIsTeacher(!!teacher)
        if (teacher?.name) setUserName(teacher.name)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setUserName('')
    setIsTeacher(false)
    router.push('/')
  }

  const centerButtonAction = () => {
    if (!user) {
      router.push('/login')
    } else {
      setShowProfilePopup(!showProfilePopup)
    }
  }

  const menuLinks = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Admission', href: '/admission', icon: AcademicCapIcon },
    { name: 'Gallery', href: '/gallery', icon: CameraIcon },
    { name: 'Notices', href: '/notices', icon: BellAlertIcon },
    { name: 'Contact', href: '/contact', icon: PhoneIcon },
  ]

  return (
    <>
      {/* Profile Popover (appears above center button) */}
      {showProfilePopup && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-white rounded-xl shadow-2xl p-4 w-64 border border-gray-200">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary-500 text-white flex items-center justify-center text-lg font-bold">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <p className="font-medium mt-2">{userName || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <div className="mt-3 space-y-1">
            <button
              onClick={() => {
                setShowProfilePopup(false)
                router.push(isTeacher ? '/teacher/dashboard' : '/student-corner')
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2 text-sm"
            >
              <UserCircleIcon className="h-5 w-5" /> Profile
            </button>
            <button
              onClick={() => {
                setShowProfilePopup(false)
                handleLogout()
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-500 flex items-center gap-2 text-sm"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar – visible only on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden">
        <div className="flex items-center justify-between px-2 py-2">
          {/* Left Section */}
          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <Link href="/" className="flex flex-col items-center px-1 py-1 text-gray-600 hover:text-primary-500">
                  <HomeIcon className="h-6 w-6" />
                  <span className="text-[10px]">Home</span>
                </Link>
                <Link href="/admission" className="flex flex-col items-center px-1 py-1 text-gray-600 hover:text-primary-500">
                  <AcademicCapIcon className="h-6 w-6" />
                  <span className="text-[10px]">Admission</span>
                </Link>
                <Link href="/gallery" className="flex flex-col items-center px-1 py-1 text-gray-600 hover:text-primary-500">
                  <CameraIcon className="h-6 w-6" />
                  <span className="text-[10px]">Gallery</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/student-corner?tab=video" className="flex flex-col items-center px-1 py-1 text-gray-600 hover:text-primary-500">
                  <PlayCircleIcon className="h-6 w-6" />
                  <span className="text-[10px]">Lectures</span>
                </Link>
                <Link href="/student-corner?tab=homework" className="flex flex-col items-center px-1 py-1 text-gray-600 hover:text-primary-500">
                  <BookOpenIcon className="h-6 w-6" />
                  <span className="text-[10px]">Homework</span>
                </Link>
              </>
            )}
          </div>

          {/* Center Round Button */}
          <div className="relative -mt-6">
            <button
              onClick={centerButtonAction}
              className="w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:bg-primary-600 transition-all"
            >
              {!user ? (
                <UserCircleIcon className="h-7 w-7" />
              ) : (
                <span className="text-xl font-bold">
                  {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <Link href="/notices" className="flex flex-col items-center px-1 py-1 text-gray-600 hover:text-primary-500">
                  <BellAlertIcon className="h-6 w-6" />
                  <span className="text-[10px]">Notices</span>
                </Link>
                <Link href="/contact" className="flex flex-col items-center px-1 py-1 text-gray-600 hover:text-primary-500">
                  <PhoneIcon className="h-6 w-6" />
                  <span className="text-[10px]">Contact</span>
                </Link>
                <button onClick={() => setShowMenu(!showMenu)} className="flex flex-col items-center px-1 py-1 text-gray-600 hover:text-primary-500">
                  <Bars3Icon className="h-6 w-6" />
                  <span className="text-[10px]">Menu</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/student-corner?tab=notes" className="flex flex-col items-center px-1 py-1 text-gray-600 hover:text-primary-500">
                  <DocumentTextIcon className="h-6 w-6" />
                  <span className="text-[10px]">Notes</span>
                </Link>
                <button onClick={() => setShowMenu(!showMenu)} className="flex flex-col items-center px-1 py-1 text-gray-600 hover:text-primary-500">
                  <Bars3Icon className="h-6 w-6" />
                  <span className="text-[10px]">Menu</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Menu Popover (for three‑line button) */}
      {showMenu && (
        <div className="fixed bottom-16 right-2 z-50 bg-white rounded-xl shadow-2xl p-3 w-48 border border-gray-200 md:hidden">
          {menuLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setShowMenu(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
            >
              <link.icon className="h-5 w-5" />
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}