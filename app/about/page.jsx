'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AboutPage() {
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
            About Naveen Academy
          </motion.h1>
          <p className="text-xl">Excellence in Education Since 2005</p>
        </div>
      </section>

      {/* School History */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-primary-500 mb-6">Our History</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Naveen Academy Senior Secondary School was established in 2005 with a vision to provide 
                quality education to the students of Chohtan and surrounding areas of Barmer district. 
                What started as a small school with just 50 students has now grown into one of the 
                most respected educational institutions in the region.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Over the years, we have consistently produced excellent board results and our students 
                have gone on to pursue successful careers in medicine, engineering, civil services, 
                and various other fields.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, Naveen Academy stands as a beacon of quality education, serving over 1000+ students 
                with state-of-the-art infrastructure and dedicated faculty.
              </p>
            </motion.div>
            <motion.div
  initial={{ opacity: 0, x: 50 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}>
  <img 
    src="/images/school-building.jpg" 
    alt="Naveen Academy Building" 
    className="rounded-2xl h-96 w-full object-cover shadow-lg"/>
</motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card"
            >
              <div className="text-4xl mb-4">👁️</div>
              <h3 className="text-2xl font-bold text-primary-500 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be a premier educational institution that nurtures young minds, fosters creativity, 
                and develops responsible global citizens who contribute positively to society. We aim to 
                create an environment where every student discovers their potential and achieves excellence 
                in academics, sports, and life.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card"
            >
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-primary-500 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide holistic education that combines academic rigor with character building. 
                We are committed to creating a supportive learning environment with modern infrastructure, 
                innovative teaching methods, and emphasis on moral values. Our mission is to empower 
                students with knowledge, skills, and confidence to face future challenges.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Director & Principal Message */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-500 text-center mb-12">Leadership Messages</h2>
          
          {/* Director Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="card mb-8"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <img 
  src="/images/director.jpg" 
  alt="Director"
  className="w-48 h-48 rounded-full object-cover flex-shrink-0"/>
              <div>
                <h3 className="text-2xl font-bold text-primary-500 mb-2">Message from Director</h3>
                <p className="text-gray-500 mb-2">Dr. Jagdish Vishnoi</p>
                <p className="text-gray-600 leading-relaxed">
                  "Education is not just about filling minds with information, but about igniting the spark 
                  of curiosity and the desire to learn. At Naveen Academy, we strive to create an environment 
                  where every child feels valued, challenged, and supported. Our commitment to excellence in 
                  education has made us one of the most trusted schools in the region."
                </p>
              </div>
            </div>
          </motion.div>

          {/* Principal Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <img 
  src="/images/principal.jpg" 
  alt="Principal"
  className="w-48 h-48 rounded-full object-cover flex-shrink-0"/>
              <div>
                <h3 className="text-2xl font-bold text-primary-500 mb-2">Message from Principal</h3>
                <p className="text-gray-500 mb-2">Mr.Prakash kr Jangid</p>
                <p className="text-gray-600 leading-relaxed">
                  "Welcome to Naveen Academy! Our school is a vibrant community of learners where we focus 
                  on the all-round development of each student. With experienced faculty, modern facilities, 
                  and a nurturing environment, we ensure that every child receives the best possible education. 
                  I invite you to be a part of our journey towards excellence."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-500 text-center mb-12">Our Infrastructure</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Smart Classrooms', desc: 'Technology-enabled classrooms with digital boards and projectors' },
              { title: 'Science Laboratories', desc: 'Well-equipped Physics, Chemistry, and Biology labs' },
              { title: 'Computer Lab', desc: 'Modern computers with high-speed internet connectivity' },
              { title: 'Library', desc: 'Rich collection of books, journals, and digital resources' },
              { title: 'Sports Complex', desc: 'Playground for cricket, football, volleyball, and indoor games' },
              { title: 'Transport Facility', desc: 'Safe and comfortable bus service covering all major routes' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card"
              >
                <h3 className="text-lg font-semibold text-primary-500 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
          }
