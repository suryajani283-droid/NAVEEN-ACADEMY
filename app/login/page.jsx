'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { EnvelopeIcon, KeyIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('email')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const sendOTP = async () => {
    setMessage('')
    if (!email) {
      setMessage('Please enter your email')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      setMessage(error.message)
    } else {
      setStep('otp')
      setMessage('')
    }
    setLoading(false)
  }

  const verifyOTP = async () => {
    setMessage('')
    if (!otp) {
      setMessage('Please enter the OTP')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    })
    if (error) {
      setMessage(error.message)
    } else {
      // Check for a redirect query parameter
const params = new URLSearchParams(window.location.search);
const redirectTo = params.get('redirect') || '/student-corner';
router.push(redirectTo);
    }
    setLoading(false)
  }

  const handleBack = () => {
    setStep('email')
    setOtp('')
    setMessage('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 pt-20 pb-12">
      <div className="w-full max-w-md">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-lg border border-slate-100 mb-4">
            <img src="/images/logo.png" alt="Naveen Academy" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-500 mt-1">Login to access your corner</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          {step === 'email' ? (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && sendOTP()}
                  />
                </div>
              </div>
              <button
                onClick={sendOTP}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md shadow-orange-200"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    Send OTP <ArrowRightIcon className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center text-sm text-slate-500">
                We sent a 6‑digit code to <span className="font-semibold text-slate-700">{email}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Verification Code</label>
                <div className="relative">
                  <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
             <input
  type="text"
  inputMode="numeric"
  maxLength={8}
  value={otp}
  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
  placeholder="Enter 6-8 digit OTP"
  className="..."
  onKeyDown={(e) => e.key === 'Enter' && verifyOTP()}
  autoFocus
/>
                </div>
              </div>
              <button
                onClick={verifyOTP}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md shadow-orange-200"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    Verify & Login <ArrowRightIcon className="h-5 w-5" />
                  </>
                )}
              </button>
              <button
                onClick={handleBack}
                className="w-full text-sm text-slate-500 hover:text-orange-600 transition-colors flex items-center justify-center gap-1"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Change email
              </button>
            </div>
          )}

          {message && (
            <p className={`mt-4 text-sm text-center ${message.includes('error') || message.includes('Invalid') ? 'text-red-500' : 'text-green-600'}`}>
              {message}
            </p>
          )}
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          Naveen Academy Senior Secondary School
        </p>
      </div>
    </div>
  )
}