"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Define the Transaction interface
interface Transaction {
    created_at: string;
    amount_paid: number | string;
}

// Define the API response structure
interface ApiResponse {
    results: Transaction[];
}

export default function DashboardChart() {
    // Use ChartData type for chartData
    const [chartData, setChartData] = useState<ChartData<"line"> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadChartData = async () => {
            try {
                const token = localStorage.getItem("access_token") || "";
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/pay/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const data: ApiResponse = await res.json();
                if (Array.isArray(data.results)) {
                    // Group transactions by date
                    const grouped: Record<string, number> = {};
                    data.results.forEach((txn: Transaction) => {
                        const date = new Date(txn.created_at).toLocaleDateString();
                        grouped[date] = (grouped[date] || 0) + Number(txn.amount_paid);
                    });

                    const labels = Object.keys(grouped);
                    const values = Object.values(grouped);

                    setChartData({
                        labels,
                        datasets: [
                            {
                                label: "Total Amount Paid (₦)",
                                data: values,
                                borderColor: "rgb(16, 185, 129)",
                                backgroundColor: "rgba(16, 185, 129, 0.2)",
                            },
                        ],
                    });
                }
            } catch (err) {
                console.error("Error loading chart data:", err);
            } finally {
                setLoading(false);
            }
        };

        loadChartData();
    }, []);

    if (loading) return <p>Loading chart...</p>;

    return (
        <div className="bg-white p-6 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Transactions Overview</h2>
            {chartData ? <Line data={chartData} /> : <p>No data available</p>}
        </div>
    );
}