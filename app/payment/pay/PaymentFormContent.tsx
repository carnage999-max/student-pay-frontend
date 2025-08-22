// app/payment/pay/PaymentFormContent.tsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchPaymentById, initiatePayment } from "@/app/lib/api/payments";
import { fetchDepartmentById } from "@/app/lib/api/departments";
import { BUTTON_PRIMARY, INPUT } from "@/app/ui/constants";

interface Payment {
    id: string;
    payment_for: string;
    amount_due: number;
}

interface Department {
    id: string;
    dept_name: string;
}

export default function PaymentFormContent() {
    const searchParams = useSearchParams();
    const payment_id = searchParams.get("payment_id");
    const department_id = searchParams.get("department_id");

    const [payment, setPayment] = useState<Payment | null>(null);
    const [department, setDepartment] = useState<Department | null>(null);
    const [form, setForm] = useState({
        customer_email: "",
        first_name: "",
        last_name: "",
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!payment_id || !department_id) return;

        const loadData = async () => {
            try {
                const [pay, dept] = await Promise.all([
                    fetchPaymentById(payment_id, department_id),
                    fetchDepartmentById(department_id),
                ]);
                setPayment(pay);
                setDepartment(dept);
            } catch (err) {
                console.error(err);
                setError("Failed to load payment or department.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [payment_id, department_id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            const res = await initiatePayment({
                ...form,
                payment: String(payment_id),
                department: String(department_id),
            });
            if (res?.authorization_url) {
                window.location.href = res.authorization_url;
            } else {
                setError("Invalid response from server");
            }
            setSuccess("Payment initiated successfully.");
            console.log(res);
        } catch (err) {
            console.error(err);
            setError("Payment initiation failed.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="inset-0 bg-white">
            <h2 className="text-xl font-semibold mb-4 text-black">Complete Your Payment</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : (
                <>
                    <div className="mb-4 text-gray-700">
                        <p><strong>Department:</strong> {department?.dept_name}</p>
                        <p><strong>Payment for:</strong> {payment?.payment_for}</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            name="customer_email"
                            value={form.customer_email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                            className={INPUT}
                            title="Enter your email address"
                        />
                        <input
                            type="text"
                            name="first_name"
                            value={form.first_name}
                            onChange={handleChange}
                            placeholder="First Name"
                            required
                            className={INPUT}
                            title="Enter your first name"
                        />
                        <input
                            type="text"
                            name="last_name"
                            value={form.last_name}
                            onChange={handleChange}
                            placeholder="Last Name"
                            required
                            className={INPUT}
                            title="Enter your last name"
                        />
                        <input
                            type="text"
                            name="amount"
                            value={`Amount: ${payment?.amount_due ?? ""}`}
                            readOnly
                            className={INPUT}
                            title="Payment amount"
                        />
                        <button
                            type="submit"
                            disabled={submitting}
                            className={BUTTON_PRIMARY}
                            title="Pay now"
                        >
                            {submitting ? "Processing..." : `Pay now => ${payment?.amount_due ?? ""}`}
                        </button>
                        {error && <p className="text-red-600">{error}</p>}
                        {success && <p className="text-green-600">{success}</p>}
                    </form>
                </>
            )}
        </div>
    );
}