'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams();
    const department_id = searchParams.get('department_id');

    const backLink = department_id
        ? `/department/payment/`
        : '/';

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border border-gray-200">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-black">Student Payment Portal</h1>
                <Link
                    href={backLink}
                    className="text-sm text-blue-600 hover:underline"
                >
                    ← Leave Payment
                </Link>
            </header>

            <div className="bg-white shadow-md rounded-lg p-6">
                {children}
            </div>
        </div>
    </div>
    );
}
