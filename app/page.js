'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import {
  AcademicCapIcon,
  MapPinIcon,
  BookOpenIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ComputerDesktopIcon,
  BeakerIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline'
import ResultsMarquee from '../components/ResultsMarquee'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Icon mapping for "Why Choose Us" (because JSON can't store components)
const iconMap = {
  AcademicCapIcon: AcademicCapIcon,
  ComputerDesktopIcon: ComputerDesktopIcon,
  BeakerIcon: BeakerIcon,
  TrophyIcon: TrophyIcon,
  BookOpenIcon: BookOpenIcon,
  ShieldCheckIcon: ShieldCheckIcon,
}

export default function Home() {
  const [content, setContent] = useState({})

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from('homepage_content').select('*')
      if (data) {
        const map = {}
        data.forEach(item => { map[item.section] = item.content })
        setContent(map)
      }
    }
    fetchContent()
  }, [])

  // Default fallback while loading
  const hero = content.hero || { title: 'Naveen Academy', tagline: 'Senior Secondary School', subtitle: 'Building Future Leaders with Quality Education', admission_text: 'Admission Open 2026-27', phone_number: '+918766003200', background_image: '/images/school-building.jpg' }
  const quickInfo = content.quick_info || { affiliation: 'RBSE Affiliated', affiliation_no: 'Aff. No: 1730XXX', classes: 'Nursery to XII', medium: 'English & Hindi', location: 'Chohtan, Barmer', transport: 'Available' }
  const about = content.about || { text: 'Loading...', image: '/images/school-building.jpg' }
  const whyChooseUs = content.why_choose_us || []
  const facilities = content.facilities || []
  const academicPrograms = content.academic_programs || []
  const achievements = content.achievements || []
  const testimonials = content.testimonials || []
  const admissionCta = content.admission_cta || { title: 'Admissions Open for 2026-27', subtitle: 'Give your child the best education at Naveen Academy', apply_text: 'Apply Now', contact_text: 'Contact Us' }

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${hero.background_image}')` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute top-20 left-0 right-0 z-20">
          <ResultsMarquee />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">{hero.title}</h1>
            <p className="text-2xl md:text-3xl mb-4">{hero.tagline}</p>
            <p className="text-xl mb-8">{hero.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admission" className="btn-secondary text-lg px-8 py-4">
                {hero.admission_text}
              </Link>
              <a href={`tel:${hero.phone_number}`} className="bg-white text-primary-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all text-lg">
                Call Now
              </a>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-0 right-0">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center"
          >
            <div className="animate-bounce bg-white p-2 w-10 h-10 ring-1 ring-slate-900/5 shadow-lg rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-white shadow-lg -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-6">
            <div className="text-center">
              <AcademicCapIcon className="h-8 w-8 mx-auto text-primary-500 mb-2" />
              <p className="font-semibold">{quickInfo.affiliation}</p>
              <p className="text-sm text-gray-600">{quickInfo.affiliation_no}</p>
            </div>
            <div className="text-center">
              <BookOpenIcon className="h-8 w-8 mx-auto text-primary-500 mb-2" />
              <p className="font-semibold">Classes</p>
              <p className="text-sm text-gray-600">{quickInfo.classes}</p>
            </div>
            <div className="text-center">
              <UserGroupIcon className="h-8 w-8 mx-auto text-primary-500 mb-2" />
              <p className="font-semibold">Medium</p>
              <p className="text-sm text-gray-600">{quickInfo.medium}</p>
            </div>
            <div className="text-center">
              <MapPinIcon className="h-8 w-8 mx-auto text-primary-500 mb-2" />
              <p className="font-semibold">Location</p>
              <p className="text-sm text-gray-600">{quickInfo.location}</p>
            </div>
            <div className="text-center">
              <ShieldCheckIcon className="h-8 w-8 mx-auto text-primary-500 mb-2" />
              <p className="font-semibold">Transport</p>
              <p className="text-sm text-gray-600">{quickInfo.transport}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title text-left">About Our School</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{about.text}</p>
              <Link href="/about" className="btn-primary inline-block">
                Read More About Us
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
            >
              <img src={about.image} alt="Naveen Academy Building" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Why Choose Naveen Academy?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {whyChooseUs.map((item, index) => {
              const IconComponent = iconMap[item.icon] || null
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card text-center"
                >
                  {IconComponent && <IconComponent className="h-12 w-12 mx-auto text-primary-500 mb-4" />}
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Our Facilities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {facilities.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card text-center hover:bg-primary-50 cursor-pointer"
              >
                <span className="text-4xl mb-3 block">{item.icon}</span>
                <h3 className="font-semibold">{item.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Programs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Academic Programs</h2>
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            {academicPrograms.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="card border-t-4 border-primary-500"
              >
                <h3 className="text-xl font-bold text-primary-500 mb-2">{program.level}</h3>
                <p className="text-sm text-gray-500 mb-3">Classes {program.classes}</p>
                <p className="text-gray-600">{program.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{item.number}</div>
                <div className="text-lg">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="section-title">What Parents Say</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {testimonials.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="card"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary-500 font-bold">{item.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.class}</p>
                  </div>
                </div>
                <p className="text-gray-600">"{item.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission CTA */}
      <section className="py-20 bg-secondary-500">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {admissionCta.title}
            </h2>
            <p className="text-xl text-white mb-8">{admissionCta.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admission" className="bg-white text-secondary-500 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all text-lg">
                {admissionCta.apply_text}
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-all text-lg">
                {admissionCta.contact_text}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
        }
