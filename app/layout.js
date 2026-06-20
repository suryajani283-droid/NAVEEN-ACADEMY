import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import AdBanner from '../components/AdBanner'
import ScrollToTop from '../components/ScrollToTop'
import AdmissionMarquee from '../components/AdmissionMarquee'

export const metadata = {
  title: 'Naveen Academy Senior Secondary School | Best School in Chohtan, Barmer',
  description: 'Naveen Academy offers quality education. Admissions Open 2026-27.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Hind:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
<script
  dangerouslySetInnerHTML={{
    __html: `
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js').then(function(reg) {
            console.log('SW registered!', reg.scope);
          }).catch(function(err) {
            console.error('SW registration failed:', err);
          });
        });
      }
    `,
  }}
/>
      </head>
      <body
        className="flex flex-col min-h-screen"
        style={{ fontFamily: "'Poppins', 'Hind', sans-serif" }}
      >
        <AdmissionMarquee />
        <ServiceWorkerRegister />
        <Navbar />
        <main className="flex-1 flex flex-col">
          <div className="flex-1">{children}</div>
          <AdBanner />
        </main>
        <Footer />
        <WhatsAppButton />
        <ScrollToTop />
      </body>
    </html>
  )
}