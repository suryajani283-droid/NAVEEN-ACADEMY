'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { EnvelopeIcon, KeyIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function LoginPage() {
  const [mode, setMode] = useState('otp')   // 'otp' or 'password'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpStep, setOtpStep] = useState('email')   // 'email' | 'otp'
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // ---------- OTP FLOW ----------
  const sendOTP = async () => {
    setMessage('')
    if (!email) { setMessage('Please enter your email'); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setMessage(error.message)
    else { setOtpStep('otp'); setMessage('OTP sent! Check your email.') }
    setLoading(false)
  }

  const verifyOTP = async () => {
    setMessage('')
    if (!otp) { setMessage('Please enter the OTP'); return }
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' })
    if (error) {
      setMessage(error.message.includes('expired') ? 'OTP expired. Request a new one.' : 'Invalid OTP.')
    } else {
      await redirectAfterLogin()
    }
    setLoading(false)
  }

  // ---------- PASSWORD FLOW ----------
  const loginWithPassword = async () => {
    setMessage('')
    if (!email || !password) { setMessage('Please fill all fields'); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    else await redirectAfterLogin()
    setLoading(false)
  }

  // ---------- REDIRECT AFTER LOGIN ----------
  const redirectAfterLogin = async () => {
    // Check if profile exists
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (!profile) {
        router.push('/complete-profile')
        return
      }
    }
    const params = new URLSearchParams(window.location.search)
    const redirectTo = params.get('redirect') || '/student-corner'
    router.push(redirectTo)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 pt-20 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-lg border border-slate-100 mb-4">
            <img src="/images/logo.png" alt="Naveen Academy" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-500 mt-1">Login to access your corner</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          {/* Mode Tabs */}
          <div className="flex mb-6 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => { setMode('otp'); setMessage(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'otp' ? 'bg-white shadow text-slate-800' : 'text-slate-500'
              }`}
            >
              Email OTP
            </button>
            <button
              onClick={() => { setMode('password'); setMessage(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'password' ? 'bg-white shadow text-slate-800' : 'text-slate-500'
              }`}
            >
              Email & Password
            </button>
          </div>

          {/* OTP Mode */}
          {mode === 'otp' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    disabled={otpStep === 'otp'}
                  />
                </div>
              </div>
              {otpStep === 'otp' ? (
                <>
                  <div className="relative">
                    <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text" inputMode="numeric" maxLength={8} value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                      autoFocus
                    />
                  </div>
                  <button onClick={verifyOTP} disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
                    {loading ? 'Verifying...' : <>Verify & Login <ArrowRightIcon className="h-5 w-5" /></>}
                  </button>
                  <div className="flex justify-between text-sm">
                    <button onClick={() => { setOtpStep('email'); setOtp(''); setMessage(''); }}
                      className="text-slate-500 hover:text-orange-600">← Change email</button>
                    <button onClick={sendOTP} disabled={loading}
                      className="text-orange-500 hover:text-orange-600">Resend OTP</button>
                  </div>
                </>
              ) : (
                <button onClick={sendOTP} disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
                  {loading ? 'Sending...' : <>Send OTP <ArrowRightIcon className="h-5 w-5" /></>}
                </button>
              )}
            </div>
          )}

          {/* Password Mode */}
          {mode === 'password' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" />
                </div>
              </div>
              <button onClick={loginWithPassword} disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
                {loading ? 'Logging in...' : <>Sign In <ArrowRightIcon className="h-5 w-5" /></>}
              </button>
              <p className="text-sm text-slate-500 text-center">
                No password? <button onClick={() => setMode('otp')} className="text-orange-500 hover:text-orange-600">Use Email OTP</button>
              </p>
            </div>
          )}

          {message && (
            <p className={`mt-4 text-sm text-center ${message.includes('error') || message.includes('Invalid') || message.includes('expired') ? 'text-red-500' : 'text-green-600'}`}>
              {message}
            </p>
          )}
        </div>
        <p className="text-center text-slate-400 text-xs mt-6">Naveen Academy Senior Secondary School</p>
      </div>
    </div>
  )
}