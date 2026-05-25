export default function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        We’ll be back soon!
      </h1>
      <p className="text-lg text-gray-600 max-w-md">
        Naveen Academy is currently undergoing scheduled maintenance.
        Please check back in a few minutes.
      </p>
      <div className="mt-8 text-6xl">🛠️</div>
    </div>
  );
}