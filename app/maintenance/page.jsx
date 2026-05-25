export const dynamic = 'force-dynamic';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <div className="text-6xl mb-6">🚧</div>
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Under Maintenance</h1>
        <p className="text-xl text-slate-600 mb-8">
          Our website is currently undergoing scheduled maintenance.<br />
          We'll be back shortly. Thank you for your patience.
        </p>
        <div className="animate-pulse text-primary-500 font-semibold">
          Please check back soon!
        </div>
      </div>
    </div>
  )
}