'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  AcademicCapIcon, 
  MapPinIcon, 
  PhoneIcon, 
  ClockIcon,
  BeakerIcon,
  ComputerDesktopIcon,
  BookOpenIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  TrophyIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import ResultsMarquee from '../components/ResultsMarquee'
export default function Home() {
  return (
    <div>
    <ResultsMarquee />
      {/* Hero Section */}
    <section 
  className="relative h-screen flex items-center bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/images/school-building.jpg')" }}
>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Naveen Academy
            </h1>
            <p className="text-2xl md:text-3xl mb-4">
              Senior Secondary School
            </p>
            <p className="text-xl mb-8">
              Building Future Leaders with Quality Education
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admission" className="btn-secondary text-lg px-8 py-4">
                Admission Open 2026-27
              </Link>
              <a href="tel:+918766003200" className="bg-white text-primary-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all text-lg">
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
              <p className="font-semibold">RBSE Affiliated</p>
              <p className="text-sm text-gray-600">Aff. No: 1730XXX</p>
            </div>
            <div className="text-center">
              <BookOpenIcon className="h-8 w-8 mx-auto text-primary-500 mb-2" />
              <p className="font-semibold">Classes</p>
              <p className="text-sm text-gray-600">Nursery to XII</p>
            </div>
            <div className="text-center">
              <UserGroupIcon className="h-8 w-8 mx-auto text-primary-500 mb-2" />
              <p className="font-semibold">Medium</p>
              <p className="text-sm text-gray-600">English & Hindi</p>
            </div>
            <div className="text-center">
              <MapPinIcon className="h-8 w-8 mx-auto text-primary-500 mb-2" />
              <p className="font-semibold">Location</p>
              <p className="text-sm text-gray-600">Chohtan, Barmer</p>
            </div>
            <div className="text-center">
              <ShieldCheckIcon className="h-8 w-8 mx-auto text-primary-500 mb-2" />
              <p className="font-semibold">Transport</p>
              <p className="text-sm text-gray-600">Available</p>
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
              <p className="text-gray-600 mb-6 leading-relaxed">
                Naveen Academy Senior Secondary School, established with a vision to provide quality education 
                in the Chohtan region of Barmer district, has been a beacon of learning and excellence. 
                Our school is affiliated with CBSE and offers education from Nursery to Class XII with 
                Science, Arts, and Commerce streams.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We believe in holistic development of students through academic excellence, sports, 
                cultural activities, and value-based education. Our state-of-the-art infrastructure, 
                experienced faculty, and modern teaching methodologies ensure that every student reaches 
                their full potential.
              </p>
              <Link href="/about" className="btn-primary inline-block">
                Read More About Us
              </Link>
            </motion.div>
            <motion.div
  initial={{ opacity: 0, x: 50 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
  className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
  <img 
    src="/images/school-building.jpg" 
    alt="Naveen Academy Building" 
    className="w-full h-full object-cover"/>
</motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Why Choose Naveen Academy?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: AcademicCapIcon,
                title: 'Experienced Faculty',
                description: 'Highly qualified teachers with years of experience in their respective subjects'
              },
              {
                icon: ComputerDesktopIcon,
                title: 'Smart Classes',
                description: 'Modern digital classrooms with interactive learning technology'
              },
              {
                icon: BeakerIcon,
                title: 'Science Labs',
                description: 'Well-equipped Physics, Chemistry, and Biology laboratories'
              },
              {
                icon: TrophyIcon,
                title: 'Sports Facilities',
                description: 'Excellent sports infrastructure for overall physical development'
              },
              {
                icon: BookOpenIcon,
                title: 'Competitive Preparation',
                description: 'Special coaching for JEE, NEET, and other competitive exams'
              },
              {
                icon: ShieldCheckIcon,
                title: 'Discipline',
                description: 'Focus on character building and discipline along with academics'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card text-center"
              >
                <item.icon className="h-12 w-12 mx-auto text-primary-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Our Facilities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { name: 'Biology Lab', icon: '🧬' },
              { name: 'Physics Lab', icon: '⚡' },
              { name: 'Chemistry Lab', icon: '🧪' },
              { name: 'Library', icon: '📚' },
              { name: 'Computer Lab', icon: '💻' },
              { name: 'Playground', icon: '⚽' },
              { name: 'CCTV Security', icon: '📹' },
              { name: 'Smart Classes', icon: '🖥️' }
            ].map((facility, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card text-center hover:bg-primary-50 cursor-pointer"
              >
                <span className="text-4xl mb-3 block">{facility.icon}</span>
                <h3 className="font-semibold">{facility.name}</h3>
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
            {[
              { level: 'Primary', classes: 'I to V', description: 'Strong foundation in basic subjects with activity-based learning' },
              { level: 'Middle', classes: 'VI to VIII', description: 'Comprehensive curriculum with focus on conceptual understanding' },
              { level: 'Secondary', classes: 'IX to X', description: 'CBSE curriculum with preparation for board examinations' },
              { level: 'Senior Secondary', classes: 'XI to XII', description: 'Science, Arts & Commerce streams with competitive exam preparation' }
            ].map((program, index) => (
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
            {[
              { number: '95%', label: 'Board Results' },
              { number: '50+', label: 'Awards Won' },
              { number: '1000+', label: 'Students' },
              { number: '50+', label: 'Expert Faculty' }
            ].map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{achievement.number}</div>
                <div className="text-lg">{achievement.label}</div>
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
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item * 0.2 }}
                className="card"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary-500 font-bold">P{item}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Parent Name</h4>
                    <p className="text-sm text-gray-500">Parent of Class {item + 7}</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Naveen Academy has provided excellent education to my child. The teachers are very supportive 
                  and the infrastructure is great. I'm very satisfied with my child's progress."
                </p>
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
              Admissions Open for 2026-27
            </h2>
            <p className="text-xl text-white mb-8">
              Give your child the best education at Naveen Academy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admission" className="bg-white text-secondary-500 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all text-lg">
                Apply Now
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-all text-lg">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
              }
