'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '../../components/ThemeProvider'
import { useLanguage } from '../../components/LanguageProvider'

export default function SettingsPage() {
  const { dark, toggleTheme } = useTheme()
  const { t } = useLanguage()
  const [version, setVersion] = useState('')
  const router = useRouter()

  useEffect(() => {
    setVersion('1.0.0')

    // Load Google Translate script if not already present
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = function () {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,gu,mr,pa,te,ta,kn,bn,or,as,ne',
            layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,
            autoDisplay: false,
          },
          'google_translate_element'
        )
      }
    }

    // Append the external script if it hasn't been added
    if (!document.querySelector('script[src*="translate.google.com/translate_a/element.js"]')) {
      const script = document.createElement('script')
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    }
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

  return (
    <div className="container mx-auto px-4 py-8 mt-24 md:mt-28 max-w-md">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('settings')}</h1>

      <div className="space-y-6">
        {/* Dark / Light Mode */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <span className="font-medium">{dark ? t('lightMode') : t('darkMode')}</span>
          <button
            onClick={toggleTheme}
            className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-full text-sm"
          >
            {dark ? '☀️ ' + t('lightMode') : '🌙 ' + t('darkMode')}
          </button>
        </div>

        {/* Google Translate Language Switcher */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="font-medium mb-3">{t('language')}</h3>
          <div id="google_translate_element"></div>
          <p className="text-xs text-gray-500 mt-2">
            Select any language to translate the entire site instantly.
          </p>
        </div>

        {/* Push Notifications */}
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
          <span className="font-medium">{t('clearCache')}</span>
          <button
            onClick={clearCache}
            className="bg-red-500 text-white px-4 py-2 rounded-full text-sm"
          >
            {t('clearCache')}
          </button>
        </div>

        {/* Version */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('version')}: {version}
          </p>
        </div>

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