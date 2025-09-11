'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/app/lib/auth/token';
import { refreshAccessToken } from '../auth/refresh';
import { logout } from '../auth/logout';

// Store verification status to avoid repeated API calls
let cachedVerificationStatus: boolean | null = null;
let lastCheckTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check verification status
const checkVerificationStatus = async (): Promise<boolean | null> => {
    const now = Date.now();

    // Return cached result if still valid
    if (cachedVerificationStatus !== null && (now - lastCheckTime) < CACHE_DURATION) {
        return cachedVerificationStatus;
    }

    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return null;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/department/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (res.ok) {
            const data = await res.json();

            // Handle array response - get first department (current user's dept)
            const department = Array.isArray(data) ? data[0] : data;

            if (department && typeof department.is_verified === 'boolean') {
                cachedVerificationStatus = department.is_verified;
                lastCheckTime = now;
                return department.is_verified;
            }
        }
        return null;
    } catch (error) {
        console.error('Error checking verification status:', error);
        return null;
    }
};

// Clear cache when needed
export const clearVerificationCache = () => {
    cachedVerificationStatus = null;
    lastCheckTime = 0;
};

// Main auth flow handler
const handleAuthFlow = async (router: any, allowUnverified = false) => {
    if (typeof window === "undefined") return;

    // Step 1: Check if authenticated
    if (!isAuthenticated()) {
        router.replace('/department/login?reason=unauthorized');
        return;
    }

    // Step 2: Refresh token if needed
    const success = await refreshAccessToken();
    if (!success) {
        logout();
        clearVerificationCache();
        router.replace('/department/login?reason=session-expired');
        return;
    }

    // Step 3: Check verification status (unless explicitly allowing unverified)
    if (!allowUnverified) {
        const isVerified = await checkVerificationStatus();

        if (isVerified === false) {
            router.replace('/department/verification-pending?reason=unverified_account');
            return;
        } else if (isVerified === null) {
            // API error - let them stay but clear cache for next attempt
            clearVerificationCache();
            return;
        }
    }

    return true; // All checks passed
};

// Hook for protecting dashboard routes (requires verification)
export const useAuthGuard = () => {
    const router = useRouter();

    useEffect(() => {
        handleAuthFlow(router, false); // Require verification
    }, [router]);
};

// Hook for login/signup pages (redirect if already authenticated)
export const useRedirectIfAuthenticated = (redirectTo = '/department/dashboard') => {
    const router = useRouter();

    useEffect(() => {
        const checkAndRedirect = async () => {
            if (!isAuthenticated()) return;

            const isVerified = await checkVerificationStatus();

            if (isVerified === true) {
                router.push(redirectTo);
            } else if (isVerified === false) {
                router.push('/department/verification-pending?reason=unverified_account');
            }
            // If null (error), stay on current page
        };

        checkAndRedirect();
    }, [router, redirectTo]);
};

// Hook for verification pending page
export const useVerificationGuard = () => {
    const router = useRouter();

    useEffect(() => {
        const check = async () => {
            if (!isAuthenticated()) {
                router.replace('/department/login?reason=unauthorized');
                return;
            }

            // Force a fresh check (clear cache) when manually checking status
            clearVerificationCache();
            const isVerified = await checkVerificationStatus();

            if (isVerified === true) {
                router.replace('/department/dashboard');
            } else if (isVerified === null) {
                // API error - could show error message but stay on page
                console.error('Unable to check verification status');
            }
            // If false, stay on verification pending page
        };

        check();
    }, [router]);
};

// Utility function to manually refresh verification status
export const refreshVerificationStatus = async (): Promise<boolean | null> => {
    clearVerificationCache();
    return await checkVerificationStatus();
};