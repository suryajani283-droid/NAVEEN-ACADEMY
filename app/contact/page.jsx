'use client'
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

// Supabase client will be set later (only in the browser)
let supabaseClient = null;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  // Initialize Supabase client only on the client side
  useEffect(() => {
    import('../../lib/supabase').then((mod) => {
      supabaseClient = mod.supabase;
      setReady(true);
    });
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!supabaseClient) {
      setError('System not ready. Please try again.')
      return
    }
    setError('')
    const { error: insertError } = await supabaseClient.from('contact_queries').insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    })
    if (insertError) {
      setError('Something went wrong. Please try again.')
    } else {
      setSubmitted(true)
    }
  }

  return (
    <div className="pt-20">
      {/* ... rest of the JSX stays exactly the same ... */}
    </div>
  )
}
