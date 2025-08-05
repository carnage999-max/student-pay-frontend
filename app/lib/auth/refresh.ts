import { logout } from './logout';
import { setAccessToken, getAccessToken } from './token';

export const refreshAccessToken = async (): Promise<boolean> => {
    const ref = {"refresh": localStorage.getItem('refresh_token')};
    const token = getAccessToken();
    if (!token) return false;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/token/refresh/`, {
            method: 'POST',
            body: JSON.stringify(ref),
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!res.ok) {
            throw new Error('Token refresh failed');
        }

        const data = await res.json();
        setAccessToken(data.access);
        return true;
    } catch (err) {
        console.error('Refresh error:', err);
        logout();
        return false;
    }
};
