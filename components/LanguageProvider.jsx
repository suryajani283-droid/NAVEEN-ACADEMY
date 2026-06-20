'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const LanguageContext = createContext()

export function useLanguage() {
  return useContext(LanguageContext)
}

const translations = {
  en: {
    home: 'Home',
    about: 'About',
    academics: 'Academics',
    faculty: 'Faculty',
    studentCorner: 'Student Corner',
    parentCorner: 'Parent Corner',
    gallery: 'Gallery',
    admission: 'Admission',
    notices: 'Notices',
    settings: 'Settings',
    login: 'Login',
    teacherLogin: 'Teacher Login',
    logout: 'Logout',
    admissionOpen: 'Admission Open 2026-27',
    navTitle: 'Naveen Academy',
    navSubtitle: 'Sr. Sec. School, Chohtan',
    footerDesc: 'Senior Secondary School providing quality education in Chohtan, Barmer, Rajasthan.',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    clearCache: 'Clear Cache',
    version: 'App Version',
  },
  hi: {
    home: 'होम',
    about: 'हमारे बारे में',
    academics: 'शैक्षणिक',
    faculty: 'शिक्षक गण',
    studentCorner: 'विद्यार्थी कोना',
    parentCorner: 'अभिभावक कोना',
    gallery: 'गैलरी',
    admission: 'प्रवेश',
    notices: 'सूचनाएँ',
    settings: 'सेटिंग्स',
    login: 'लॉग इन',
    teacherLogin: 'शिक्षक लॉगिन',
    logout: 'लॉग आउट',
    admissionOpen: 'प्रवेश 2026-27 खुला है',
    navTitle: 'नवीन अकादमी',
    navSubtitle: 'सी. सै. स्कूल, चौहटन',
    footerDesc: 'चौहटन, बाड़मेर, राजस्थान में गुणवत्तापूर्ण शिक्षा प्रदान करने वाला सीनियर सेकेंडरी स्कूल।',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
    language: 'भाषा',
    clearCache: 'कैश साफ़ करें',
    version: 'ऐप वर्जन',
  }
}

export default function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('app-language')
    if (saved === 'hi' || saved === 'en') setLang(saved)
  }, [])

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'hi' : 'en'
    setLang(newLang)
    localStorage.setItem('app-language', newLang)
  }

  const t = (key) => translations[lang]?.[key] || key

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}