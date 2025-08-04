'use client';

import { useEffect, useState } from 'react';
import { fetchPaymentsByDepartment } from '@/app/lib/api/payments';
import { useRouter } from 'next/navigation';

type PaymentItem = {
    id: number;
    payment_for: string;
    amount_due: number;
};

export default function DepartmentModal({
    department,
    onClose,
}: {
    department: { id: string; dept_name: string };
    onClose: () => void;
}) {

    const [payments, setPayments] = useState<PaymentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchPaymentsByDepartment(department.id);
                setPayments(data);
            } catch (err) {
                console.error('Failed to fetch payments:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [department.id]);

    const handlePaymentClick = (paymentId: number) => {
        router.push(`/payment/pay?payment_id=${paymentId}&department_id=${department.id}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50 transition-all duration-300 ease-in-out">
            <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
                >
                    &times;
                </button>

                <h2 className="text-lg font-semibold mb-4">
                    Payments for {department.dept_name}
                </h2>

                {loading ? (
                    <p>Loading payments...</p>
                ) : payments.length === 0 ? (
                    <p className="text-gray-500">No payments found.</p>
                ) : (
                    <ul className="space-y-3">
                        {payments.map((p) => (
                            <li
                                key={p.id}
                                className="bg-blue-50 p-3 rounded hover:bg-blue-100 cursor-pointer"
                                onClick={() => handlePaymentClick(p.id)}
                            >
                                <div className="font-medium text-blue-700">{p.payment_for}</div>
                                <div className="text-sm text-gray-600">
                                    Amount: ₦{p.amount_due.toLocaleString()}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
