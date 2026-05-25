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
      className="fixed z-50 bg-green-500 text-white rounded-full shadow-2xl hover:bg-green-600 transition-all
           bottom-16 right-4 md:bottom-6 md:right-6 p-4 md:p-5"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      animate={{
        boxShadow: [
          '0 0 0 0 rgba(34, 197, 94, 0.5)',
          '0 0 0 20px rgba(34, 197, 94, 0)',
          '0 0 0 0 rgba(34, 197, 94, 0.5)',
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    >
      <FaWhatsapp className="text-2xl md:text-4xl" />
    </motion.a>
  )
}