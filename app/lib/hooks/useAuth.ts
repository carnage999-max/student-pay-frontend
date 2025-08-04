"use client";

import { useState, useEffect } from "react";

interface AuthData {
    access_token: string | null;
    refresh_token: string | null;
    dept_id: string | null;
}

export function useAuth() {
    const [auth, setAuth] = useState<AuthData>({
        access_token: null,
        refresh_token: null,
        dept_id: null,
    });

    // Load from localStorage initially
    useEffect(() => {
        const access_token = localStorage.getItem("access_token");
        const refresh_token = localStorage.getItem("refresh_token");
        const dept_id = localStorage.getItem("department_id");

        if (access_token && refresh_token && dept_id) {
            setAuth({ access_token, refresh_token, dept_id });
        }
    }, []);

    // Save to localStorage when updated
    useEffect(() => {
        if (auth.access_token && auth.refresh_token && auth.dept_id) {
            localStorage.setItem("access_token", auth.access_token);
            localStorage.setItem("refresh_token", auth.refresh_token);
            localStorage.setItem("department_id", auth.dept_id);
        }
    }, [auth]);

    // Refresh token if needed
    const refreshAuthToken = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/token/refresh/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: auth.refresh_token }),
            });

            if (!res.ok) throw new Error("Failed to refresh token");
            const data = await res.json();

            setAuth((prev) => ({
                ...prev,
                access_token: data.access,
            }));
            localStorage.setItem("access_token", data.access);
        } catch (err) {
            console.error("Token refresh failed", err);
            logout();
        }
    };

    const logout = () => {
        localStorage.clear();
        setAuth({ access_token: null, refresh_token: null, dept_id: null });
    };

    return {
        ...auth,
        setAuth,
        refreshAuthToken,
        logout,
        isAuthenticated: !!auth.access_token,
    };
}
