'use client'
export const dynamic = 'force-dynamic';
import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

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

export default function AdmissionPage() {
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    classApplying: '',
    phone: '',
    email: '',
    address: '',
    previousSchool: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: insertError } = await supabase.from('admissions').insert({
      student_name: formData.studentName,
      father_name: formData.fatherName,
      mother_name: formData.motherName,
      date_of_birth: formData.dateOfBirth || null,
      class_applying: formData.classApplying,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      previous_school: formData.previousSchool,
    })

    if (insertError) {
      setError('Something went wrong. Please try again.')
    } else {
      setSubmitted(true)
    }
    setLoading(false)
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Admissions Open 2026-27
          </motion.h1>
          <p className="text-xl">Join Naveen Academy for a bright future</p>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Admission Process</h2>
          <div className="grid md:grid-cols-4 gap-8 mt-12">
            {[
              { step: '01', title: 'Inquiry', description: 'Visit school or fill online inquiry form' },
              { step: '02', title: 'Registration', description: 'Submit registration form with documents' },
              { step: '03', title: 'Interaction', description: 'Student and parent interaction with principal' },
              { step: '04', title: 'Admission', description: 'Fee payment and admission confirmation' },
            ].map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="text-4xl font-bold text-primary-500 mb-4">{process.step}</div>
                <h3 className="text-xl font-semibold mb-2">{process.title}</h3>
                <p className="text-gray-600">{process.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Online Admission Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="section-title">Online Admission Form</h2>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card text-center py-12"
            >
              <span className="text-6xl mb-4 block">🎉</span>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Application Submitted Successfully!</h3>
              <p className="text-gray-600 mb-6">We will contact you soon for the next steps.</p>
              <Link href="/" className="btn-primary">Back to Home</Link>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student Name *</label>
                  <input type="text" name="studentName" required value={formData.studentName} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name *</label>
                  <input type="text" name="fatherName" required value={formData.fatherName} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Name *</label>
                  <input type="text" name="motherName" required value={formData.motherName} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class Applying For *</label>
                  <select name="classApplying" required value={formData.classApplying} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option value="">Select Class</option>
                    <option value="Nursery">Nursery</option>
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>Class {i + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea name="address" rows="3" value={formData.address} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Previous School</label>
                  <input type="text" name="previousSchool" value={formData.previousSchool} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              {error && <p className="text-red-500 mt-4">{error}</p>}
              <div className="mt-8 text-center">
                <button type="submit" disabled={loading} className="btn-primary text-lg px-12">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </section>

      {/* Fee Structure (your exact table) */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Fee Structure</h2>
          <div className="overflow-x-auto mt-8">
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
                    <td className="py-4 px-6">{fee.class}</td>
                    <td className="py-4 px-6">{fee.Admission}</td>
                    <td className="py-4 px-6">{fee.annual}</td>
                    <td className="py-4 px-6">{fee.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-4">* Transport fee additional as per distance. Contact school office for details.</p>
        </div>
      </section>
    </div>
  )
      }
