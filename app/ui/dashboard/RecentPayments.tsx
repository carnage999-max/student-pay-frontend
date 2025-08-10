"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function RecentTransactions() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [error, setError] = useState<string>("");

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const token = localStorage.getItem("access_token") || "";
                const res = await fetch(`${API_BASE}/pay/pay/?page=${currentPage}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch transactions");
                }

                const data = await res.json();

                // Guard and normalise
                const results = Array.isArray(data.results) ? data.results : [];
                setTransactions(results);

                // derive page size from results length (fallback to 5 if 0)
                const pageSize = results.length > 0 ? results.length : 5;
                setTotalPages(
                    data.count && pageSize > 0 ? Math.max(1, Math.ceil(data.count / pageSize)) : 1
                );
            } catch (err: any) {
                console.error("Error fetching transactions:", err);
                setError(err?.message || "Error fetching transactions");
                setTransactions([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [currentPage, API_BASE]);

    // builds a compact pagination array (numbers + '...' markers)
    const getPaginationRange = (current: number, total: number, maxShown = 7) => {
        if (total <= maxShown) return Array.from({ length: total }, (_, i) => i + 1);

        const range: (number | string)[] = [];
        const left = Math.max(2, current - 2);
        const right = Math.min(total - 1, current + 2);

        range.push(1);

        if (left > 2) range.push("...");
        for (let i = left; i <= right; i++) range.push(i);
        if (right < total - 1) range.push("...");

        range.push(total);
        return range;
    };

    const downloadReceipt = async (url: string | null) => {
        if (!url) return;
        try {
            // Try fetching blob to force download (works reliably for same-origin or CORS-enabled resources)
            const res = await fetch(url);
            if (!res.ok) throw new Error("Could not fetch receipt");
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = blobUrl;

            // infer a filename from the url
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
            // fallback: open in new tab
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div className="bg-white p-6 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions
                <Link
                    href="/department/dashboard/transactions"
                    className="text-emerald-600 hover:underline ml-2 font-semibold text-right">
                    View all payments
                </Link>
            </h2>
            <div className="mt-6 text-center text-xs text-gray-500">

            </div>
            {loading ? (
                <p className="text-gray-700">Loading...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : transactions.length === 0 ? (
                <p className="text-gray-500">No transactions yet.</p>
            ) : (
                <>
                    <ul className="divide-y divide-gray-200">
                        {transactions.map((txn) => (
                            <li key={txn.txn_id} className="flex justify-between items-center py-3">
                                <div>
                                    <p className="font-medium text-black">{txn.received_from}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(txn.created_at).toLocaleString(undefined, {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>

                                <div className="text-right flex flex-col items-end">
                                    <p className="font-semibold text-black">
                                        ₦{Number(txn.amount_paid).toLocaleString()}
                                    </p>
                                    <p
                                        className={`text-sm ${txn.status === "success" ? "text-green-600" : "text-red-600"}`}
                                    >
                                        {txn.status}
                                    </p>

                                    <div className="mt-1 flex items-center gap-2">
                                        {txn.receipt_url && (
                                            <button
                                                onClick={() => downloadReceipt(txn.receipt_url)}
                                                className="text-sm bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-1 rounded hover:bg-emerald-100 transition"
                                            >
                                                Download Receipt
                                            </button>
                                        )}

                                        {/* optional view in new tab */}
                                        {txn.receipt_url && (
                                            <a
                                                href={txn.receipt_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-gray-500 hover:underline"
                                            >
                                                View
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Pagination controls */}
                    <nav className="mt-4 flex items-center justify-center gap-2" aria-label="Pagination">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md ${currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
                        >
                            Prev
                        </button>

                        {getPaginationRange(currentPage, totalPages).map((item, idx) =>
                            typeof item === "string" ? (
                                <span key={`dots-${idx}`} className="px-2 text-gray-500">…</span>
                            ) : (
                                <button
                                    key={item}
                                    onClick={() => setCurrentPage(item)}
                                    aria-current={item === currentPage ? "page" : undefined}
                                    className={`min-w-[36px] px-3 py-1 rounded-md border ${item === currentPage ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}
                                >
                                    {item}
                                </button>
                            )
                        )}

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-md ${currentPage === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
                        >
                            Next
                        </button>
                    </nav>

                    <p className="mt-3 text-center text-xs text-gray-500">
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="mt-6 text-center text-xs text-gray-500">
                        <p>Showing {transactions.length} transactions out of {totalPages * 5 - 1} total</p>
                    </div>
                </>
            )}
        </div>
    );
}
