'use client'
import { useEffect, useState } from 'react'

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

export default function DebugSubscribe() {
  const [status, setStatus] = useState('Click the button to subscribe')
  const [error, setError] = useState('')

  const subscribe = async () => {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!vapidKey) {
      setError('VAPID public key missing. Is it set in Render?')
      return
    }
    try {
      const reg = await navigator.serviceWorker.ready
      const existing = await reg.pushManager.getSubscription()
      if (existing) {
        setStatus('Already subscribed. Unsubscribing first...')
        await existing.unsubscribe()
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      })
      // Save to backend
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub)
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('Subscription saved successfully!')
      } else {
        setError('Backend error: ' + JSON.stringify(data))
      }
    } catch (err) {
      console.error(err)
      setError('Subscription error: ' + err.message)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 mt-16">
      <h1 className="text-2xl font-bold mb-4">Push Notification Debug</h1>
      <p className="mb-4">Current status: {status}</p>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <button
        onClick={subscribe}
        className="bg-[#B4542C] text-white px-6 py-3 rounded-lg"
      >
        Subscribe Now
      </button>
    </div>
  )
}