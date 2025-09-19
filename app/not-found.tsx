// app/not-found.tsx
import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* 404 Number */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-emerald-600 mb-4">404</h1>
                    <div className="w-24 h-1 bg-emerald-600 mx-auto rounded-full"></div>
                </div>

                {/* Content */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                        The page you're looking for doesn't exist or has been moved.
                        Let's get you back on track.
                    </p>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <Link
                        href="/"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                        <Home className="w-4 h-4" />
                        <span>Go to Homepage</span>
                    </Link>

                    <div className="flex space-x-4">
                        <Link
                            href="/department/login"
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors text-center"
                        >
                            Department Login
                        </Link>
                        <Link
                            href="/department/departments"
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors text-center"
                        >
                            Make Payment
                        </Link>
                    </div>
                </div>

                {/* Help Section */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">
                        Still having trouble? Contact our support team:
                    </p>
                    <div className="space-y-2 text-sm">
                        <p>
                            <a
                                href="mailto:studentpaydesk@proton.me"
                                className="text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                                studentpaydesk@proton.me
                            </a>
                        </p>
                        <p>
                            <a
                                href="https://wa.me/2348163899213"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                                WhatsApp: +234 816 389 9213
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}