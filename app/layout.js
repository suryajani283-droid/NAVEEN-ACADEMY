import './globals.css'
import { Poppins, Hind } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins'
})

const hind = Hind({ 
  subsets: ['devanagari'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hind'
})

export const metadata = {
  title: 'Naveen Academy Senior Secondary School | Best School in Chohtan, Barmer',
  description: 'Naveen Academy Senior Secondary School offers quality education from Primary to Senior Secondary. Admissions Open 2024-25.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${hind.variable} font-sans`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
