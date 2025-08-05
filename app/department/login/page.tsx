'use client'

import Login from '@/app/ui/Login';
import { useRedirectIfAuthenticated } from '@/app/lib/hooks/useAuth';
import { useSearchParams } from 'next/navigation';

export default function Page() {
    useRedirectIfAuthenticated();
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason');

    return (
        <div className="max-w-md mx-auto mt-10">
            {reason === 'session-expired' && (
                <div className="mb-4 text-red-600 text-sm">
                    Your session has expired. Please log in again.
                </div>
            )}

            {reason === 'unauthorized' && (
                <div className="mb-4 text-yellow-600 text-sm">
                    Please log in to continue.
                </div>
            )}
            <Login />
        </div>
    )
}