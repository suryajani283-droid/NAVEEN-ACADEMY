import './globals.css'
import AdmissionMarquee from '../components/AdmissionMarquee'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import AdBanner from '../components/AdBanner'
import ServiceWorkerRegister from '../components/ServiceWorkerRegister'
import ScrollToTop from '../components/ScrollToTop'
import MobileBottomNav from '../components/MobileBottomNav';

export const metadata = {
  title: 'Naveen Academy Senior Secondary School | Best School in Chohtan, Barmer',
  description: 'Naveen Academy offers quality education. Admissions Open 2026-27.',
}

export default function RootLayout({ children }) {
 // Add this state and useEffect inside RootLayout (before return)
const [maintenance, setMaintenance] = useState(false);
const [checking, setChecking] = useState(true);

useEffect(() => {
  const checkMaintenance = async () => {
    try {
      const res = await fetch('/api/maintenance');
      if (res.ok) {
        const data = await res.json();
        if (data.maintenance_mode && !window.location.pathname.startsWith('/admin') && window.location.pathname !== '/maintenance') {
          window.location.href = '/maintenance';
          return;
        }
      }
    } catch {}
    setChecking(false);
  };
  checkMaintenance();
}, []); 





return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Hind:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="flex flex-col min-h-screen"
        style={{ fontFamily: "'Poppins', 'Hind', sans-serif" }}
      >
        <AdmissionMarquee/>
        <ServiceWorkerRegister />
        <ScrollToTop />
        <Navbar />
        <MobileBottomNav/>
        <main className="flex-1 flex flex-col pb-16 md:pb-0">
          <div className="flex-1">{children}</div>
          <AdBanner />
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}