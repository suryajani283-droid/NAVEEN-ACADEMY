import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'

export const metadata = {
  title: 'Naveen Academy Senior Secondary School | Best School in Chohtan, Barmer',
  description: 'Naveen Academy offers quality education. Admissions Open 2024-25.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
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
