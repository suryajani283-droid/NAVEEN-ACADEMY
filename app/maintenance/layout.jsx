export const metadata = {
  title: 'Under Maintenance – Naveen Academy',
  description: 'We are currently under maintenance. Please check back soon.',
}

export default function MaintenanceLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        {children}
      </body>
    </html>
  )
}