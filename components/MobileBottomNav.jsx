'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import {
  HomeIcon,
  AcademicCapIcon,
  CameraIcon,
  PlayCircleIcon,
  BookOpenIcon,
  DocumentTextIcon,
  Bars3Icon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  BellAlertIcon,
  PhoneIcon,
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
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
        if (profile?.full_name) setUserName(profile.full_name)

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

  // Define buttons based on login state
  const leftButtons = !user
    ? [
        { name: 'Home', href: '/', icon: HomeIcon },
        { name: 'Admission', href: '/admission', icon: AcademicCapIcon },
      ]
    : [
        { name: 'Lectures', href: '/student-corner?tab=video', icon: PlayCircleIcon },
        { name: 'Homework', href: '/student-corner?tab=homework', icon: BookOpenIcon },
      ]

  const rightButtons = !user
    ? [
        { name: 'Gallery', href: '/gallery', icon: CameraIcon },
        { name: 'Menu', icon: Bars3Icon, action: () => setShowMenu(!showMenu) },
      ]
    : [
        { name: 'Notes', href: '/student-corner?tab=notes', icon: DocumentTextIcon },
        { name: 'Menu', icon: Bars3Icon, action: () => setShowMenu(!showMenu) },
      ]

  return (
    <>
      {/* Profile Popover */}
      {showProfilePopup && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-white rounded-xl shadow-2xl p-4 w-64 border border-gray-200 md:hidden">
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

      {/* Bottom Navigation – visible only on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        {/* Orange bar with rounded top corners */}
        <div className="relative bg-orange-500 rounded-t-2xl shadow-[0_-4px_15px_rgba(0,0,0,0.15)] pt-2 pb-1 px-1">
          {/* Flex container for left, center, right */}
          <div className="flex items-end justify-between">
            {/* Left buttons */}
            <div className="flex items-end gap-1 pb-1">
              {leftButtons.map((btn) => (
                <Link
                  key={btn.name}
                  href={btn.href || '#'}
                  className="flex flex-col items-center px-1 text-white hover:text-orange-100 transition-colors -translate-y-1"
                >
                  <btn.icon className="h-6 w-6" />
                  <span className="text-[10px] font-medium mt-0.5">{btn.name}</span>
                </Link>
              ))}
            </div>

            {/* Right buttons */}
            <div className="flex items-end gap-1 pb-1">
              {rightButtons.map((btn) =>
                btn.href ? (
                  <Link
                    key={btn.name}
                    href={btn.href}
                    className="flex flex-col items-center px-1 text-white hover:text-orange-100 transition-colors -translate-y-1"
                  >
                    <btn.icon className="h-6 w-6" />
                    <span className="text-[10px] font-medium mt-0.5">{btn.name}</span>
                  </Link>
                ) : (
                  <button
                    key={btn.name}
                    onClick={btn.action}
                    className="flex flex-col items-center px-1 text-white hover:text-orange-100 transition-colors -translate-y-1"
                  >
                    <btn.icon className="h-6 w-6" />
                    <span className="text-[10px] font-medium mt-0.5">{btn.name}</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Center Elevated Button */}
        <button
          onClick={centerButtonAction}
          className="absolute left-1/2 -translate-x-1/2 -top-5 w-14 h-14 rounded-full bg-white shadow-xl border-4 border-orange-500 flex items-center justify-center active:scale-95 transition-transform"
        >
          {!user ? (
            <UserCircleIcon className="h-7 w-7 text-orange-500" />
          ) : (
            <span className="text-xl font-bold text-orange-500">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </span>
          )}
        </button>
      </div>

      {/* Menu Popover */}
      {showMenu && (
        <div className="fixed bottom-20 right-2 z-50 bg-white rounded-xl shadow-2xl p-3 w-48 border border-gray-200 md:hidden">
          <Link href="/" onClick={() => setShowMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
            <HomeIcon className="h-5 w-5" /> Home
          </Link>
          <Link href="/notices" onClick={() => setShowMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
            <BellAlertIcon className="h-5 w-5" /> Notices
          </Link>
          <Link href="/contact" onClick={() => setShowMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
            <PhoneIcon className="h-5 w-5" /> Contact
          </Link>
          <Link href="/gallery" onClick={() => setShowMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
            <CameraIcon className="h-5 w-5" /> Gallery
          </Link>
        </div>
      )}
    </>
  )
}