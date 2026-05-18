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
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{ 
        boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0.5)', '0 0 0 15px rgba(34, 197, 94, 0)', '0 0 0 0 rgba(34, 197, 94, 0.5)']
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
      }}
    >
      <FaWhatsapp className="text-3xl" />
    </motion.a>
  )
}
