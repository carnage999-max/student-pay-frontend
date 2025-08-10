// app/lib/api/department.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchDashboardStats(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/pay/stats/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch stats');
    }

    return res.json();
}
