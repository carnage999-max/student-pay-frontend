"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const reference = searchParams.get("reference");
    const [receiptUrl, setReceiptUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!reference) {
            setError("No payment reference found in the URL.");
            setLoading(false);
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/pay/verify/?trxref=${reference}`)
            .then((res) => {
                if (!res.ok) throw new Error("Could not verify payment.");
                return res.json();
            })
            .then((data) => {
                setReceiptUrl(data.receipt_url);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "An unexpected error occurred.");
                setLoading(false);
            });
    }, [reference]);

    const downloadReceipt = async (url: string | null) => {
        if (!url) return;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Could not fetch receipt");
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = blobUrl;
            const filename = (() => {
                try {
                    const u = new URL(url);
                    const last = u.pathname.split("/").pop() || "receipt.pdf";
                    return last.includes(".") ? last : `${last}.pdf`;
                } catch {
                    return "receipt.pdf";
                }
            })();
            anchor.download = filename;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            URL.revokeObjectURL(blobUrl);
        } catch (err) {
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <p className="text-gray-700 text-lg">Verifying your payment...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <p className="text-red-600 font-medium text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-semibold text-center text-emerald-600 mb-4">
                ✅ Payment Successful
            </h1>
            <p className="text-center text-gray-600 mb-8">
                Your payment was successful. Check your e-mail(spam folder) for a copy of the receipt. You can also view or download your receipt below.
            </p>
            <div className="rounded-md overflow-hidden border border-gray-200 shadow">
                <div className="flex justify-center overflow-auto">
                    <iframe
                        src={receiptUrl}
                        title="Payment Receipt"
                        className="bg-gray-100 border"
                        style={{ width: "6.75in", height: "3.375in" }}
                    />
                </div>
            </div>
            <div className="text-center mt-8">
                <a
                    href={receiptUrl}
                    onClick={(e) => {
                        e.preventDefault();
                        downloadReceipt(receiptUrl);
                    }}
                    className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
                >
                    Download Receipt PDF
                </a>
            </div>
        </div>
    );
}