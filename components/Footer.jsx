import Link from 'next/link'
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* School Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Naveen Academy</h3>
            <p className="text-gray-400 mb-4">
              Senior Secondary School providing quality education in Chohtan, Barmer, Rajasthan.
            </p>
            <p className="text-gray-400">RBSE Affiliation No: 1730XXX</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Academics', 'Faculty', 'Gallery', 'Admission', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Important Links</h4>
            <ul className="space-y-2">
              {[
                'Student Corner',
                'Parent Corner',
                'Notices',
                'Results',
                'Fee Structure',
                'Transport'
              ].map((item) => {
                const href = item === 'Results'
                  ? '/student-corner?tab=results'
                  : `/${item.toLowerCase().replace(' ', '-')}`

                return (
                  <li key={item}>
                    <Link 
                      href={href}
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-primary-400 mt-1" />
                <p className="text-gray-400">
                  Naveen Academy, Main Road<br />
                  Chohtan, Barmer<br />
                  Rajasthan - 344702
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-primary-400" />
                <a href="tel:+917665212779" className="text-gray-400 hover:text-primary-400 transition-colors">
                  +917665212779
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-primary-400" />
                <a href="mailto:info@naveenacademy.in" className="text-gray-400 hover:text-primary-400 transition-colors">
                  info@naveenacademy.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Naveen Academy Senior Secondary School. All rights reserved.</p>
          <p className="mt-2">
            Designed & Developed with ❤️ for Quality Education
          </p>
        </div>
      </div>
    </footer>
  )
}