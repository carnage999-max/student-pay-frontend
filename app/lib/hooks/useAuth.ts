'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/app/lib/auth/token';
import { refreshAccessToken } from '../auth/refresh';
import { logout } from '../auth/logout';

export const useAuthGuard = () => {
    const router = useRouter();

    useEffect(() => {
        if (typeof window === "undefined") return;
        const check = async () => {
            if (!isAuthenticated()) {
                router.replace('/department/login?reason=unauthorized');
                return;
            }

            const success = await refreshAccessToken();

            if (!success) {
                logout();
                router.replace('/department/login?reason=session-expired');
            }
        };

        check();
    }, []);
};

export const useRedirectIfAuthenticated = (redirectTo = '/') => {
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated()) {
            router.push(redirectTo);
        }
    }, []);
};
