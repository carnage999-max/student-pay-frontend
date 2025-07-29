"use client";
import { useEffect, useState } from "react";
import { fetchPayments } from "@/app/lib/api/fetchpayments";

export default function RecentPayments() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPayments = async () => {
            try {
                const data = await fetchPayments();
                setPayments(data);
            } catch {
                setPayments([]);
            } finally {
                setLoading(false);
            }
        };
        loadPayments();
    }, []);

    return (
        <div className="bg-white p-6 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
            {loading ? (
                <p>Loading...</p>
            ) : payments.length === 0 ? (
                <p>No payments yet.</p>
            ) : (
                <ul className="space-y-3">
                    {payments.slice(0, 5).map((payment) => (
                        <li key={payment.id} className="flex justify-between border-b pb-2">
                            <span className="font-medium">{payment.title}</span>
                            <span className="text-sm text-gray-600">
                                ₦{payment.amount_expected.toLocaleString()}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
