export const dynamic = 'force-dynamic'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl mb-8">🚧</div>
        <h1 className="text-5xl font-extrabold text-slate-800 mb-4">
          Under Maintenance
        </h1>
        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
          We're currently performing scheduled maintenance to improve your experience.
          <br />
          The website will be back online shortly.
        </p>
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-6 py-3">
          <span className="animate-pulse w-3 h-3 bg-amber-500 rounded-full"></span>
          <span className="text-amber-700 font-medium">Estimated time: 30 minutes</span>
        </div>
        <p className="mt-10 text-slate-400 text-sm">
          For urgent inquiries:<br />
          <a href="tel:+917665212779" className="text-primary-500 font-medium">
            +91 76652 12779
          </a>
        </p>
      </div>
    </div>
  )
}