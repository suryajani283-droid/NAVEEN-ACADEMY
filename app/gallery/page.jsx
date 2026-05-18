'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedImage, setSelectedImage] = useState(null)

  const categories = ['All', 'Events', 'Sports', 'Labs', 'Annual Function', 'Tours', 'Classroom']

  const galleryItems = [
    { category: 'Events', title: 'Independence Day 2024', src: '/images/event1.jpg'},
    { category: 'Sports', title: 'Annual Sports Meet', src: '/images/event1.jpg' },
    { category: 'Labs', title: 'Science Laboratory', src: '/images/sciencelab.jpg' },
    { category: 'Annual Function', title: 'Cultural Program', src: '/images/farewell.jpg' },
    { category: 'Tours', title: 'Educational Tour 2024', src: '/images/tour.jpg' },
    { category: 'Classroom', title: 'Smart Class Session', src: '/images/event1.jpg' },
    { category: 'Events', title: 'Republic Day Celebration', src: '/images/event1.jpg' },
    { category: 'Sports', title: 'Cricket Tournament', src: '/images/event1.jpg' },
    { category: 'Labs', title: 'Computer Lab', src: '/images/event1.jpg' },
    { category: 'Annual Function', title: 'Prize Distribution', src: '/images/event1.jpg' },
    { category: 'Tours', title: 'Industrial Visit', src: '/images/event1.jpg' },
    { category: 'Classroom', title: 'Project Presentation', src: '/images/event1.jpg' }
  ]

  const filteredItems = activeCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory)

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
            Gallery
          </motion.h1>
          <p className="text-xl">Glimpses of School Life at Naveen Academy</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50 sticky top-20 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-primary-500 border-2 border-primary-500 hover:bg-primary-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative group cursor-pointer overflow-hidden rounded-xl"
                onClick={() => setSelectedImage(item)}
              >
  <img 
  src={item.src} 
  alt={item.title} 
  className="h-48 md:h-64 w-full object-cover group-hover:scale-110 transition-transform duration-300"/>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-white/80 text-sm">{item.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-500 text-center mb-12">School Videos</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((video) => (
              <motion.div
                key={video}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: video * 0.2 }}
                className="card"
              >
                <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">🎥</span>
                </div>
                <h3 className="font-semibold mb-2">School Video {video}</h3>
                <p className="text-gray-600 text-sm">
                  Watch our school activities and events
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden">
            <img 
  src={selectedImage.src} 
  alt={selectedImage.title} 
  className="max-w-full max-h-[70vh] object-contain"/>
            <div className="p-6">
              <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
              <p className="text-gray-500">{selectedImage.category}</p>
            </div>
            <button 
              className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
