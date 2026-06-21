'use client'

import { useState, useEffect, useCallback } from 'react'
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function NotificationPrompt() {
  const [show, setShow] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [loading, setLoading] = useState(false)

  // Check subscription status on mount and every 30 seconds
  const checkSubscription = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      setSubscribed(!!sub)
    } catch (err) {
      console.error('Subscription check failed:', err)
    }
  }, [])

  useEffect(() => {
    checkSubscription()
    const interval = setInterval(checkSubscription, 30000) // check every 30s
    return () => clearInterval(interval)
  }, [checkSubscription])

  // Show popup every 5 minutes if not subscribed and not dismissed
  useEffect(() => {
    if (subscribed || dismissed) return
    const showPopup = () => setShow(true)
    showPopup() // show immediately first time
    const interval = setInterval(showPopup, 5 * 60 * 1000) // every 5 min
    return () => clearInterval(interval)
  }, [subscribed, dismissed])

  const handleSubscribe = async () => {
    // Safety check: VAPID key must exist
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!vapidPublicKey) {
      alert('Notifications not configured yet. Please contact the school admin.')
      console.error('NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set')
      return
    }

    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      })
      // Save to backend
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub)
      })
      setSubscribed(true)
      setShow(false)
    } catch (err) {
      console.error('Subscription failed:', err)
      alert('Could not enable notifications: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = () => {
    setShow(false)
    setDismissed(true)
  }

  if (!show || subscribed) return null

  return (
    <div className="fixed bottom-6 left-4 right-4 z-[2000] animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <BellIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Get Instant Updates!</h3>
              <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Never miss homework, notices, and school announcements.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {loading ? 'Enabling...' : 'Enable Notifications'}
              </button>
              <button
                onClick={handleDismiss}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}