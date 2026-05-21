'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import {
  BellAlertIcon,
  CurrencyRupeeIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// ---------- Circulars Section (dynamic) ----------
function CircularsSection() {
  const [circulars, setCirculars] = useState([])

  useEffect(() => {
    const fetchCirculars = async () => {
      const { data } = await supabase
        .from('parent_circulars')
        .select('*')
        .order('created_at', { ascending: false })
      setCirculars(data || [])
    }
    fetchCirculars()
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-primary-500 mb-6 flex items-center">
        <BellAlertIcon className="h-8 w-8 mr-2" />
        Latest Circulars & Notices
      </h2>
      <div className="space-y-4">
        {circulars.length === 0 && (
          <p className="text-gray-500 text-center py-8">No circulars available.</p>
        )}
        {circulars.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card border-l-4 border-primary-500 hover:shadow-xl"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.type === 'Urgent'
                        ? 'bg-red-100 text-red-600'
                        : item.type === 'Important'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {item.type}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {new Date(item.date).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ---------- PTM Section (dynamic) ----------
function PTMSection() {
  const [ptms, setPtms] = useState([])

  useEffect(() => {
    const fetchPTMs = async () => {
      const { data } = await supabase
        .from('ptm_announcements')
        .select('*')
        .order('created_at', { ascending: false })
      setPtms(data || [])
    }
    fetchPTMs()
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-primary-500 mb-6 flex items-center">
        <UserGroupIcon className="h-8 w-8 mr-2" />
        Parent-Teacher Meeting
      </h2>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {ptms.length === 0 && (
          <p className="text-gray-500 col-span-2 text-center py-8">
            No PTM announcements yet.
          </p>
        )}
        {ptms.map((ptm) => (
          <motion.div
            key={ptm.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-t-4 border-primary-500"
          >
            <h3 className="text-xl font-semibold text-primary-500 mb-3">
              {ptm.class_range}
            </h3>
            <div className="space-y-2 text-gray-600">
              <p className="flex items-center">
                <CalendarDaysIcon className="h-5 w-5 mr-2 text-primary-500" />
                {ptm.date}
              </p>
              <p className="flex items-center">
                <span className="mr-2">🕐</span>
                {ptm.time}
              </p>
              {ptm.venue && (
                <p className="flex items-center">
                  <span className="mr-2">📍</span>
                  {ptm.venue}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card bg-primary-50">
        <h3 className="text-xl font-semibold text-primary-500 mb-4">PTM Guidelines for Parents:</h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">✅</span>
            Bring your child's progress report
          </li>
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">✅</span>
            Discuss both academic and behavioral progress
          </li>
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">✅</span>
            Come with specific questions about your child's performance
          </li>
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">✅</span>
            Maintain discipline and follow time slots
          </li>
        </ul>
      </div>
    </motion.div>
  )
}

// ---------- Feedback Section (dynamic – inserts into Supabase) ----------
function FeedbackSection() {
  const [form, setForm] = useState({
    parentName: '',
    childName: '',
    class: '',
    category: 'General',
    rating: 5,
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('feedback').insert({
      parent_name: form.parentName,
      child_name: form.childName,
      class: form.class ? Number(form.class) : null,
      category: form.category,
      rating: form.rating,
      message: form.message,
    })
    if (!error) {
      setSubmitted(true)
    } else {
      alert('Submission failed: ' + error.message)
    }
  }

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto text-center py-8">
        <span className="text-5xl mb-4 block">✅</span>
        <h3 className="text-xl font-semibold text-green-600 mb-2">Feedback Submitted!</h3>
        <p className="text-gray-600">Thank you for your valuable feedback.</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 flex items-center">
        <ChatBubbleLeftRightIcon className="h-8 w-8 mr-2" />
        Your Feedback Matters
      </h2>
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parent Name *</label>
            <input
              type="text"
              required
              value={form.parentName}
              onChange={(e) => setForm({ ...form, parentName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Child's Name & Class *</label>
            <input
              type="text"
              required
              value={form.childName}
              onChange={(e) => setForm({ ...form, childName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Rahul Sharma - Class 8"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <input
              type="number"
              value={form.class}
              onChange={(e) => setForm({ ...form, class: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Class (numeric)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option>General</option>
              <option>Teaching Quality</option>
              <option>Infrastructure</option>
              <option>Communication</option>
              <option>Transport</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Feedback *</label>
            <textarea
              required
              rows="4"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Share your thoughts, suggestions, or concerns..."
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2 text-3xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setForm({ ...form, rating: star })}
                  className={`cursor-pointer hover:scale-110 transition-transform ${star <= form.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>
          <button className="w-full btn-primary py-3 text-lg">Submit Feedback</button>
        </form>
      </div>
    </motion.div>
  )
}

// ---------- Static Fee Section ----------
const feeStructure = [
  { class: 'Nursery-UKG', Admission: '₹1,100', annual: '₹6,000', total: '₹7,100' },
  { class: 'I', Admission: '₹1,100', annual: '₹7,500', total: '₹8,600' },
  { class: 'II', Admission: '₹1,100', annual: '₹8,000', total: '₹9,100' },
  { class: 'III', Admission: '₹2,100', annual: '₹8,500', total: '₹10,600' },
  { class: 'IV', Admission: '₹2,100', annual: '₹8,600', total: '₹10,700' },
  { class: 'V', Admission: '₹2,100', annual: '₹9,000', total: '₹11,100' },
  { class: 'VI', Admission: '₹2,100', annual: '₹11,000', total: '₹13,100' },
  { class: 'VII', Admission: '₹2,100', annual: '₹12,000', total: '₹14,100' },
  { class: 'VIII', Admission: '₹2,100', annual: '₹13,000', total: '₹15,100' },
  { class: 'IX', Admission: '₹3,100', annual: '₹15,000', total: '₹18,100' },
  { class: 'X', Admission: '₹3,100', annual: '₹17,000', total: '₹20,100' },
  { class: 'XIth Arts', Admission: '₹3,100', annual: '₹18,000', total: '₹21,100' },
  { class: 'XIth Science', Admission: '₹3,100', annual: '₹20,000', total: '₹23,100' },
  { class: 'XIIth Arts', Admission: '₹3,100', annual: '₹19,000', total: '₹22,100' },
  { class: 'XIIth Science', Admission: '₹3,100', annual: '₹21,000', total: '₹24,100' },
]

function FeeInfoSection() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-primary-500 mb-6 flex items-center">
        <CurrencyRupeeIcon className="h-8 w-8 mr-2" />
        Fee Structure & Payment
      </h2>

      <div className="overflow-x-auto mb-8">
        <table className="w-full bg-white rounded-xl shadow-lg">
          <thead>
            <tr className="bg-primary-500 text-white">
              <th className="py-4 px-6 text-left">Class</th>
              <th className="py-4 px-6 text-left">Admission Fee</th>
              <th className="py-4 px-6 text-left">Annual Fee</th>
              <th className="py-4 px-6 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {feeStructure.map((fee, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{fee.class}</td>
                <td className="py-4 px-6">{fee.Admission}</td>
                <td className="py-4 px-6">{fee.annual}</td>
                <td className="py-4 px-6">{fee.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'Online Payment', desc: 'Pay through UPI, Net Banking, or Card', icon: '💳' },
          { title: 'Bank Deposit', desc: 'Direct deposit in school bank account', icon: '🏦' },
          { title: 'School Office', desc: 'Pay by cash or cheque at school office', icon: '🏫' },
        ].map((method, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card text-center"
          >
            <span className="text-4xl block mb-3">{method.icon}</span>
            <h3 className="font-semibold mb-2">{method.title}</h3>
            <p className="text-gray-600 text-sm">{method.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes:</h3>
        <ul className="space-y-2 text-yellow-700">
          <li>• Fee must be paid by 15th of first month of each quarter</li>
          <li>• Late fee: ₹50 per day after due date</li>
          <li>• Transport fee separate from tuition fee</li>
          <li>• Fee receipt mandatory for examination entry</li>
        </ul>
      </div>
    </motion.div>
  )
}

// ---------- Main ParentCornerPage (with session protection) ----------
export default function ParentCornerPage() {
  const router = useRouter();
const [activeTab,setActiveTab]=useState('circulars');
const [checking, setChecking] = useState(true);

useEffect(() => {
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // Redirect to login with the current page as the return destination
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/login?redirect=${returnUrl}`);
    } else {
      setChecking(false);
    }
  };
  checkSession();
}, [router]);

// Show a stylish loading screen while checking
if (checking) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <svg className="animate-spin h-10 w-10 text-orange-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="mt-4 text-slate-500">Checking authentication...</p>
      </div>
    </div>
  );
}

  const tabs = [
    { id: 'circulars', name: 'Circulars', icon: BellAlertIcon },
    { id: 'ptm', name: 'PTM', icon: UserGroupIcon },
    { id: 'feedback', name: 'Feedback', icon: ChatBubbleLeftRightIcon },
    { id: 'fees', name: 'Fee Info', icon: CurrencyRupeeIcon },
  ]

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Parent Corner 👨‍👩‍👧‍👦
          </motion.h1>
          <p className="text-xl">Stay Connected with Your Child's Education Journey</p>
        </div>
      </section>

      {/* Quick Action Cards */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '📞', title: 'Call School', action: 'tel:+919414123456' },
              { icon: '💬', title: 'WhatsApp', action: 'https://wa.me/919414123456' },
              { icon: '📧', title: 'Email Us', action: 'mailto:info@naveenacademy.in' },
              { icon: '💰', title: 'Pay Fees', action: '#fees' },
            ].map((item, index) => (
              <motion.a
                key={index}
                href={item.action}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card text-center hover:shadow-2xl cursor-pointer group"
              >
                <span className="text-4xl block mb-2">{item.icon}</span>
                <span className="font-semibold text-gray-700 group-hover:text-primary-500">
                  {item.title}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="bg-white shadow-md sticky top-20 z-30">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:bg-primary-50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {activeTab === 'circulars' && <CircularsSection />}
          {activeTab === 'ptm' && <PTMSection />}
          {activeTab === 'feedback' && <FeedbackSection />}
          {activeTab === 'fees' && <FeeInfoSection />}
        </div>
      </section>

      {/* Helpline Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-primary-500 mb-6">Parent Helpline</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="card">
              <PhoneIcon className="h-8 w-8 text-primary-500 mx-auto mb-3" />
              <h3 className="font-semibold">Phone Support</h3>
              <p className="text-gray-600">+91 94141 23456</p>
              <p className="text-sm text-gray-500">Mon-Sat, 8 AM - 4 PM</p>
            </div>
            <div className="card">
              <EnvelopeIcon className="h-8 w-8 text-primary-500 mx-auto mb-3" />
              <h3 className="font-semibold">Email Support</h3>
              <p className="text-gray-600">parents@naveenacademy.in</p>
              <p className="text-sm text-gray-500">Reply within 24 hours</p>
            </div>
            <div className="card">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary-500 mx-auto mb-3" />
              <h3 className="font-semibold">WhatsApp</h3>
              <p className="text-gray-600">+91 94141 23456</p>
              <p className="text-sm text-gray-500">Quick response guaranteed</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}