'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BellAlertIcon,
  CurrencyRupeeIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

export default function ParentCornerPage() {
  const [activeTab, setActiveTab] = useState('circulars')

  const tabs = [
    { id: 'circulars', name: 'Circulars', icon: BellAlertIcon },
    { id: 'fees', name: 'Fee Info', icon: CurrencyRupeeIcon },
    { id: 'ptm', name: 'PTM', icon: UserGroupIcon },
    { id: 'feedback', name: 'Feedback', icon: ChatBubbleLeftRightIcon }
  ]

  const circulars = [
    {
      title: 'Parent-Teacher Meeting Schedule',
      date: '2024-03-25',
      type: 'Important',
      description: 'PTM for all classes will be held on 30th March 2024. Timings: 9 AM to 2 PM.'
    },
    {
      title: 'Fee Payment Reminder - 4th Quarter',
      date: '2024-03-20',
      type: 'Urgent',
      description: 'Last date for 4th quarter fee payment is 31st March 2024. Late fee applicable after due date.'
    },
    {
      title: 'School Timing Change for Summer',
      date: '2024-03-15',
      type: 'Notice',
      description: 'From 1st April, school timing will be 7:30 AM to 1:30 PM due to summer season.'
    },
    {
      title: 'Annual Function Invitation',
      date: '2024-03-10',
      type: 'Event',
      description: 'Parents are invited to Annual Function on 15th April 2024 at 5 PM in school auditorium.'
    },
    {
      title: 'Transport Route Changes',
      date: '2024-03-05',
      type: 'Notice',
      description: 'New bus routes added for Kalyanpur and Dhorimana areas. Contact transport incharge.'
    }
  ]

  const feeStructure = [
    { class: 'Nursery-UKG', quarterly: '₹2,400', annual: '₹9,600', transport: '₹800/month' },
    { class: 'I-V', quarterly: '₹2,700', annual: '₹10,800', transport: '₹800/month' },
    { class: 'VI-VIII', quarterly: '₹3,000', annual: '₹12,000', transport: '₹900/month' },
    { class: 'IX-X', quarterly: '₹3,600', annual: '₹14,400', transport: '₹900/month' },
    { class: 'XI-XII', quarterly: '₹4,500', annual: '₹18,000', transport: '₹1,000/month' }
  ]

  const ptmSchedule = [
    { class: 'Nursery-V', date: '30 March 2024', time: '9:00 AM - 11:00 AM', venue: 'Primary Wing' },
    { class: 'VI-VIII', date: '30 March 2024', time: '11:00 AM - 1:00 PM', venue: 'Middle Wing' },
    { class: 'IX-X', date: '31 March 2024', time: '9:00 AM - 11:00 AM', venue: 'Secondary Wing' },
    { class: 'XI-XII', date: '31 March 2024', time: '11:00 AM - 1:00 PM', venue: 'Senior Wing' }
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
              { icon: '💰', title: 'Pay Fees', action: '#fees' }
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

          {/* Circulars Section */}
          {activeTab === 'circulars' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-bold text-primary-500 mb-6 flex items-center">
                <BellAlertIcon className="h-8 w-8 mr-2" />
                Latest Circulars & Notices
              </h2>
              <div className="space-y-4">
                {circulars.map((circular, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card border-l-4 border-primary-500 hover:shadow-xl"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            circular.type === 'Urgent' 
                              ? 'bg-red-100 text-red-600'
                              : circular.type === 'Important'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                            {circular.type}
                          </span>
                          <span className="text-gray-500 text-sm">{circular.date}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{circular.title}</h3>
                        <p className="text-gray-600">{circular.description}</p>
                      </div>
                      <button className="text-primary-500 hover:text-primary-600 font-medium whitespace-nowrap">
                        Read More →
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Fee Information */}
          {activeTab === 'fees' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-bold text-primary-500 mb-6 flex items-center">
                <CurrencyRupeeIcon className="h-8 w-8 mr-2" />
                Fee Structure & Payment
              </h2>
              
              {/* Fee Table */}
              <div className="overflow-x-auto mb-8">
                <table className="w-full bg-white rounded-xl shadow-lg">
                  <thead>
                    <tr className="bg-primary-500 text-white">
                      <th className="py-4 px-6 text-left">Class</th>
                      <th className="py-4 px-6 text-left">Quarterly Fee</th>
                      <th className="py-4 px-6 text-left">Annual Fee</th>
                      <th className="py-4 px-6 text-left">Transport</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeStructure.map((fee, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium">{fee.class}</td>
                        <td className="py-4 px-6">{fee.quarterly}</td>
                        <td className="py-4 px-6">{fee.annual}</td>
                        <td className="py-4 px-6">{fee.transport}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Payment Methods */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: 'Online Payment', desc: 'Pay through UPI, Net Banking, or Card', icon: '💳' },
                  { title: 'Bank Deposit', desc: 'Direct deposit in school bank account', icon: '🏦' },
                  { title: 'School Office', desc: 'Pay by cash or cheque at school office', icon: '🏫' }
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
          )}

          {/* PTM Section */}
          {activeTab === 'ptm' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-bold text-primary-500 mb-6 flex items-center">
                <UserGroupIcon className="h-8 w-8 mr-2" />
                Parent-Teacher Meeting
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {ptmSchedule.map((ptm, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card border-t-4 border-primary-500"
                  >
                    <h3 className="text-xl font-semibold text-primary-500 mb-3">
                      {ptm.class}
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
                      <p className="flex items-center">
                        <span className="mr-2">📍</span>
                        {ptm.venue}
                      </p>
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
          )}

          {/* Feedback Section */}
          {activeTab === 'feedback' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-primary-500 mb-6 flex items-center">
                <ChatBubbleLeftRightIcon className="h-8 w-8 mr-2" />
                Your Feedback Matters
              </h2>
              
              <div className="card">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Child's Name & Class *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Rahul Sharma - Class 8"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback Category
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                      <option>Teaching Quality</option>
                      <option>Infrastructure</option>
                      <option>Communication</option>
                      <option>Transport</option>
                      <option>General Suggestion</option>
                      <option>Complaint</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Feedback *
                    </label>
                    <textarea
                      required
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Share your thoughts, suggestions, or concerns..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2 text-3xl">
                      {[1,2,3,4,5].map(star => (
                        <span key={star} className="cursor-pointer hover:scale-110 transition-transform">
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full btn-primary py-3 text-lg">
                    Submit Feedback
                  </button>
                </form>
              </div>
            </motion.div>
          )}
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
