'use client';

import { useEffect, useState } from 'react';
import { fetchDashboardStats } from '@/app/lib/api/dashboard';
import RecentPayments from '@/app/ui/dashboard/RecentPayments';
import DashboardChart from '@/app/ui/dashboard/DashboardChart';
import StatCard from '@/app/ui/dashboard/StatCard';
import { useAuthGuard } from '@/app/lib/hooks/useAuth';

type DashboardStats = {
    total_payments: number;
    total_amount: number;
    total_transactions: number;
};

const initialStats: DashboardStats = {
    total_payments: 0,
    total_amount: 0,
    total_transactions: 0,
};

export default function DashboardPage() {
    useAuthGuard();
    const [stats, setStats] = useState<DashboardStats>(initialStats);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadStats = async () => {
            try {
                const token = localStorage.getItem('access_token') || '';
                const data = await fetchDashboardStats(token);
                setStats(data);
            } catch (err: any) {
                setError('Could not load stats');
                console.error(err);
                // Leave initial stats as fallback values
            }
        };

        loadStats();
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {error && (
                <p className="mb-4 text-sm text-red-600 bg-red-100 px-4 py-2 rounded">
                    {error}
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Payments Created" value={stats.total_payments} />
                <StatCard title="Amount Paid" value={`₦${stats.total_amount.toLocaleString()}`} />
                <StatCard title="Transactions" value={stats.total_transactions} />
            </div>
            <div className="space-y-8">
                <DashboardChart />
                <RecentPayments />
            </div>
        </div>
    );
}