export const metadata = {
  title: 'Under Maintenance – Naveen Academy',
  description: 'We are currently under maintenance. Please check back soon.',
}

export default function MaintenanceLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}