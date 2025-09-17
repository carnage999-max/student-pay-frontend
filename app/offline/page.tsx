'use client';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">📱</div>
        <h1 className="text-3xl font-bold text-emerald-800 mb-4">
          You're Offline
        </h1>
        <p className="text-emerald-700 mb-6">
          StudentPay requires an internet connection. Please check your connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}