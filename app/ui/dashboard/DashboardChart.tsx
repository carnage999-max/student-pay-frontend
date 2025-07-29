"use client";
import { useEffect, useState } from "react";
import { fetchPayments } from "@/app/lib/api/fetchpayments";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

export default function DashboardChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const loadChart = async () => {
            try {
                const res = await fetchPayments();
                const formatted = res.slice(0, 5).map((p: any) => ({
                    name: p.title.length > 10 ? p.title.slice(0, 10) + "..." : p.title,
                    amount: p.amount_expected,
                }));
                setData(formatted);
            } catch {
                setData([]);
            }
        };
        loadChart();
    }, []);

    return (
        <div className="bg-white p-6 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Payments Overview</h2>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
