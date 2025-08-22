'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuthGuard } from '@/app/lib/hooks/useAuth';

interface Payment {
    txn_id: number;
    received_from: string;
    payment_for?: string;
    status?: string;
    amount_paid: string;
    created_at: string;
    receipt_url?: string;
}

export default function TransactionsPage() {
    useAuthGuard();

    const [transactions, setTransactions] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showAll, setShowAll] = useState(false);

    // Filters & sorting
    const [searchInput, setSearchInput] = useState(''); // controlled input
    const [search, setSearch] = useState(''); // debounced value
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [paymentForFilter, setPaymentForFilter] = useState('');
    const [receivedFromFilter, setReceivedFromFilter] = useState('');
    const [sortField, setSortField] = useState<'date' | 'amount'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearch(searchInput);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchInput]);

    // Fetch data
    const fetchData = async () => {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const url = showAll
            ? `${baseUrl}/pay/pay/?page_size=1000`
            : `${baseUrl}/pay/pay/?page=${page}&page_size=5`;

        try {
            const token = localStorage.getItem('access_token') || '';
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            if (Array.isArray(data.results)) {
                setTransactions(data.results);
                setTotalPages(Math.ceil(data.count / 5));
            } else if (Array.isArray(data)) {
                setTransactions(data);
                setTotalPages(1);
            } else {
                console.error('Unexpected API response:', data);
                setTransactions([]);
            }
        } catch (err) {
            console.error('Error fetching transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, showAll]);

    // Build dropdown filter options
    const filterOptions = useMemo(() => {
        return {
            status: Array.from(new Set(transactions.map(t => t.status).filter(Boolean))),
            payment_for: Array.from(new Set(transactions.map(t => t.payment_for).filter(Boolean))),
            received_from: Array.from(new Set(transactions.map(t => t.received_from).filter(Boolean))),
        };
    }, [transactions]);

    // Apply filtering & sorting
    const filteredAndSorted = useMemo(() => {
        let data = [...transactions];

        if (search.trim()) {
            data = data.filter(t =>
                t.received_from?.toLowerCase().includes(search.toLowerCase()) ||
                t.payment_for?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (startDate) {
            data = data.filter(t => new Date(t.created_at) >= new Date(startDate));
        }
        if (endDate) {
            data = data.filter(t => new Date(t.created_at) <= new Date(endDate));
        }

        if (statusFilter) {
            data = data.filter(t => t.status === statusFilter);
        }
        if (paymentForFilter) {
            data = data.filter(t => t.payment_for === paymentForFilter);
        }
        if (receivedFromFilter) {
            data = data.filter(t => t.received_from === receivedFromFilter);
        }

        data.sort((a, b) => {
            if (sortField === 'date') {
                return sortOrder === 'asc'
                    ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            } else {
                return sortOrder === 'asc'
                    ? Number(a.amount_paid) - Number(b.amount_paid)
                    : Number(b.amount_paid) - Number(a.amount_paid);
            }
        });

        return data;
    }, [
        transactions,
        search,
        startDate,
        endDate,
        statusFilter,
        paymentForFilter,
        receivedFromFilter,
        sortField,
        sortOrder
    ]);

    return (
        <div className="p-4 sm:p-6">
            <h1 className="text-2xl font-bold mb-4">All Transactions</h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4 items-center">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="border rounded px-3 py-2 w-full sm:w-64"
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded px-3 py-2 w-full sm:w-auto"
                >
                    <option value="">All Status</option>
                    {filterOptions.status.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>

                <select
                    value={paymentForFilter}
                    onChange={(e) => setPaymentForFilter(e.target.value)}
                    className="border rounded px-3 py-2 w-full sm:w-auto"
                >
                    <option value="">All Payments</option>
                    {filterOptions.payment_for.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>

                <select
                    value={receivedFromFilter}
                    onChange={(e) => setReceivedFromFilter(e.target.value)}
                    className="border rounded px-3 py-2 w-full sm:w-auto"
                >
                    <option value="">All Users</option>
                    {filterOptions.received_from.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>

                <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value as 'date' | 'amount')}
                    className="border rounded px-3 py-2 w-full sm:w-auto"
                >
                    <option value="date">Sort by Date</option>
                    <option value="amount">Sort by Amount</option>
                </select>

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="border rounded px-3 py-2 w-full sm:w-auto"
                >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>

                <div className="flex flex-row">
                    <label className="text-sm mb-1">From</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>
                <div className="flex flex-row">
                    <label className="text-sm mb-1">To</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>

                <button
                    onClick={() => setShowAll(!showAll)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 w-full sm:w-auto"
                >
                    {showAll ? 'Show Paginated' : 'Show All'}
                </button>

                <button className='bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 w-full sm:w-auto'
                onClick={() => {
                    const res = fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/export-transactions/`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
                            },
                        }
                    )
                    res.then(response => {
                        if (response.ok) {
                            return response.blob();
                        } else {
                            throw new Error('Failed to export transactions');
                        }
                    }).then(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'transactions.csv';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    }).catch(err => {
                        console.error('Export failed:', err);
                    });
                }}>
                    Export as CSV
                </button>
                
            </div>

            {/* Table */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">Txn ID</th>
                                <th className="p-2 border">Received From</th>
                                <th className="p-2 border">Payment For</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Amount Paid</th>
                                <th className="p-2 border">Created At</th>
                                <th className="p-2 border">Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSorted.map(t => (
                                <tr key={t.txn_id}>
                                    <td className="p-2 border">{t.txn_id}</td>
                                    <td className="p-2 border">{t.received_from}</td>
                                    <td className="p-2 border">{t.payment_for || '-'}</td>
                                    <td className="p-2 border">{t.status || '-'}</td>
                                    <td className="p-2 border">
                                        ₦{Number(t.amount_paid).toLocaleString()}
                                    </td>
                                    <td className="p-2 border">
                                        {new Date(t.created_at).toLocaleString()}
                                    </td>
                                    <td className="p-2 border">
                                        {t.receipt_url && (
                                            <a
                                                href={t.receipt_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-emerald-500 hover:underline"
                                            >
                                                View
                                            </a>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {!showAll && (
                <div className="flex justify-center mt-4 space-x-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(prev => prev - 1)}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(prev => prev + 1)}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
