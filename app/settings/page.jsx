'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '../../components/ThemeProvider'

export default function SettingsPage() {
  const { dark, toggleTheme } = useTheme()
  const [language, setLanguage] = useState('en')
  const [version, setVersion] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Get app version from environment or hardcoded
    setVersion('1.0.0')
  }, [])

  const clearCache = async () => {
    if ('caches' in window) {
      const keys = await caches.keys()
      await Promise.all(keys.map(key => caches.delete(key)))
      alert('Cache cleared! App will reload.')
      window.location.reload()
    } else {
      alert('Cache API not supported.')
    }
  }

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en'
    setLanguage(newLang)
    // You can store this preference and reload or re-render texts
    localStorage.setItem('app-language', newLang)
    alert(`Language will be set to ${newLang === 'en' ? 'English' : 'हिंदी'} (feature to translate interface not implemented yet)`)
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-24 md:mt-28 max-w-md">
      <h1 className="text-3xl font-bold mb-8 text-center">Settings ⚙️</h1>

      <div className="space-y-6">
        {/* Dark / Light Mode */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <span className="font-medium">Theme</span>
          <button
            onClick={toggleTheme}
            className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-full text-sm"
          >
            {dark ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <span className="font-medium">Language / भाषा</span>
          <button
            onClick={toggleLanguage}
            className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-full text-sm"
          >
            {language === 'en' ? 'English / हिंदी' : 'हिंदी / English'}
          </button>
        </div>

        {/* Push Notification Toggle (if needed) */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <span className="font-medium">Push Notifications</span>
          <button
            onClick={() => router.push('/admin/push')}
            className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm"
          >
            Manage
          </button>
        </div>

        {/* Clear Cache */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <span className="font-medium">Clear Cache</span>
          <button
            onClick={clearCache}
            className="bg-red-500 text-white px-4 py-2 rounded-full text-sm"
          >
            Clear & Reload
          </button>
        </div>

        {/* Version Info */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">App Version: {version}</p>
        </div>

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="w-full bg-gray-500 text-white py-2 rounded-lg"
        >
          ← Back
        </button>
      </div>
    </div>
  )
}