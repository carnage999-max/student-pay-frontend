'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-emerald-600 mb-4 text-center">
        Welcome to StudentPay
      </h1>

      <p className="text-gray-600 text-center max-w-xl mb-8">
        Seamless payment and receipt generation for university departments and students. Secure. Simple. Fast.
      </p>

      <div className="flex gap-6 flex-col sm:flex-row">
        <Link
          href="/department/login"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md font-medium text-center"
        >
          Department Login
        </Link>

        <Link
          href="/payment/page"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium text-center"
        >
          Make a Payment
        </Link>
      </div>
    </div>
  );
}
