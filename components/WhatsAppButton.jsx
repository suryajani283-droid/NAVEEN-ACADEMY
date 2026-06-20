'use client'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'

export default function WhatsAppButton() {
  const phoneNumber = '918766003200'
  const message = 'Hello Naveen Academy, I would like to know about admissions.'

  return (
    <motion.a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-50 bottom-6 right-4 bg-green-500 text-white rounded-full shadow-lg
                 flex items-center justify-center
                 w-14 h-14 md:w-16 md:h-16
                 hover:bg-green-600 transition-colors
                 max-w-[calc(100vw-2rem)]"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <FaWhatsapp className="text-2xl md:text-3xl" />
    </motion.a>
  )
}