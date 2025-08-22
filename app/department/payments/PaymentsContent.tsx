// app/department/payments/PaymentsContent.tsx
"use client";
import { useEffect, useState } from "react";
import { useAuthGuard } from "@/app/lib/hooks/useAuth";
import { BASE_URL, department_id } from "@/app/lib/constants/constants";

interface Payment {
    id: number;
    payment_for: string;
    amount_due: number;
    created_at: string;
}

export default function PaymentsContent() {
    useAuthGuard();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editPayment, setEditPayment] = useState<Payment | null>(null);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        if (typeof window === "undefined") return;
        const token = localStorage.getItem("access_token") || "";
        loadPayments(token);
    }, []);

    const loadPayments = async (token: string) => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/accounts/department/${department_id}/payment/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch payments");
            const data = await res.json();
            setPayments(data || []);
            console.log(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setEditPayment(null);
        setTitle("");
        setAmount("");
        setShowForm(true);
    };

    const openEdit = (payment: Payment) => {
        setEditPayment(payment);
        setTitle(payment.payment_for);
        setAmount(payment.amount_due.toString());
        setShowForm(true);
    };

    const savePayment = async () => {
        if (typeof window === "undefined") return;
        const token = localStorage.getItem("access_token") || "";
        try {
            const method = editPayment ? "PUT" : "POST";
            const url = editPayment
                ? `${BASE_URL}/accounts/department/${department_id}/payment/${editPayment.id}/`
                : `${BASE_URL}/accounts/department/${department_id}/payment/`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ payment_for: title, amount_due: Number(amount) }),
            });

            if (!res.ok) throw new Error("Failed to save payment");
            setShowForm(false);
            loadPayments(token);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const deletePayment = async (id: number) => {
        if (typeof window === "undefined") return;
        if (!confirm("Are you sure you want to delete this payment?")) return;
        const token = localStorage.getItem("access_token") || "";
        try {
            const res = await fetch(`${BASE_URL}/accounts/department/${department_id}/payment/${id}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete payment");
            loadPayments(token);
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Payments</h1>
                <button
                    onClick={openCreate}
                    className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                    title="Add a new payment"
                >
                    + New Payment
                </button>
            </div>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-left">Amount</th>
                            <th className="p-3 text-left">Created</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((p) => (
                            <tr key={p.id} className="border-t">
                                <td className="p-3">{p.payment_for}</td>
                                <td className="p-3">₦{p.amount_due}</td>
                                <td className="p-3">{new Date(p.created_at).toLocaleDateString()}</td>
                                <td className="p-3 flex gap-2">
                                    <button
                                        onClick={() => openEdit(p)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        title="Edit payment"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deletePayment(p.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        title="Delete payment"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {payments.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center p-4">
                                    No payments yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {showForm && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={() => setShowForm(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold mb-4">
                            {editPayment ? "Edit Payment" : "Create Payment"}
                        </h2>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded mb-3"
                            title="Enter payment title"
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 border rounded mb-3"
                            title="Enter payment amount"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={savePayment}
                                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}