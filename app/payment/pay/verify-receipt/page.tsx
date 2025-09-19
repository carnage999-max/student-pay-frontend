'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, AlertCircle, Clock, CreditCard, Building2, Hash, Search, QrCode } from 'lucide-react';

type VerificationResult = {
    status: string;
    transaction_id?: string;
    amount?: number;
    date?: string;
    department?: string;
};

export default function VerifyReceiptPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const receiptHash = searchParams.get('hash');

    const [loading, setLoading] = useState(false);
    const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
    const [error, setError] = useState('');
    const [manualHash, setManualHash] = useState('');

    useEffect(() => {
        if (receiptHash) {
            verifyReceipt(receiptHash);
        }
    }, [receiptHash]);

    const verifyReceipt = async (hash: string) => {
        if (!hash.trim()) {
            setError('Please enter a receipt hash');
            return;
        }

        setLoading(true);
        setError('');
        setVerificationResult(null);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/verify?hash=${hash.trim()}`
            );

            const data = await res.json();

            if (res.ok && data.status === 'valid') {
                setVerificationResult(data);
            } else {
                setError(data.detail || 'Receipt not found or invalid');
            }
        } catch (err) {
            setError('Network error occurred while verifying receipt');
        } finally {
            setLoading(false);
        }
    };

    const handleManualVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualHash.trim()) {
            router.push(`/payment/pay/verify-receipt?hash=${manualHash.trim()}`);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // No hash provided - show manual input
    if (!receiptHash) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-12 px-4">
                <div className="max-w-lg mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <QrCode className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Receipt</h1>
                        <p className="text-gray-600">Enter your receipt hash to verify payment authenticity</p>
                    </div>

                    {/* Manual Input Form */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                        <form onSubmit={handleManualVerify} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Receipt Hash
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={manualHash}
                                        onChange={(e) => setManualHash(e.target.value)}
                                        placeholder="Enter receipt hash (e.g. abc123def456...)"
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    The receipt hash can be found on your PDF receipt or scanned from the QR code
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-4 h-4" />
                                        <span>Verify Receipt</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Help Section */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">How to find your receipt hash:</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Check your PDF receipt - the hash is printed at the bottom</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Scan the QR code on your receipt to automatically verify</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Contact the department if you can't locate your receipt</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Receipt</h2>
                    <p className="text-gray-600">Please wait while we verify your payment...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 max-w-md w-full text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/verify-receipt')}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            Try Another Receipt
                        </button>
                        <a
                            href="/"
                            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors text-center"
                        >
                            Go to Homepage
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Invalid receipt
    if (!verificationResult || verificationResult.status !== 'valid') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8 max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Receipt Invalid</h1>
                    <p className="text-gray-600 mb-6">
                        This receipt could not be verified or does not exist in our system.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/payment/pay/verify-receipt')}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            Try Another Receipt
                        </button>
                        <a
                            href="/"
                            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors text-center"
                        >
                            Go to Homepage
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Valid receipt
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Success Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-8 mb-6 text-center">
                    <div className="relative">
                        <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 bg-emerald-100 rounded-full animate-ping opacity-20"></div>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Receipt Verified</h1>
                    <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">Authentic StudentPay Receipt</span>
                    </div>
                </div>

                {/* Receipt Details */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6">
                        <h2 className="text-xl font-bold text-white mb-2">Transaction Receipt</h2>
                        <p className="text-emerald-100">Payment verification details</p>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Transaction ID */}
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
                                <div className="flex items-center justify-center space-x-2 mb-3">
                                    <Hash className="w-6 h-6 text-emerald-600" />
                                    <h3 className="text-lg font-semibold text-emerald-800">Transaction ID</h3>
                                </div>
                                <p className="text-2xl font-bold text-emerald-900 font-mono tracking-wider">
                                    {verificationResult.transaction_id}
                                </p>
                            </div>
                        </div>

                        {/* Amount and Department Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-blue-700">Amount Paid</p>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-blue-900">
                                    {formatCurrency(verificationResult.amount || 0)}
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-purple-700">Department</p>
                                    </div>
                                </div>
                                <p className="text-xl font-bold text-purple-900">
                                    {verificationResult.department}
                                </p>
                            </div>
                        </div>

                        {/* Payment Date */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Payment Date & Time</p>
                                </div>
                            </div>
                            <p className="text-xl font-semibold text-gray-900">
                                {verificationResult.date ? formatDate(verificationResult.date) : 'N/A'}
                            </p>
                        </div>

                        {/* Receipt Hash */}
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
                            <div className="flex items-start space-x-3">
                                <Hash className="w-5 h-5 text-emerald-600 mt-1" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-emerald-700 mb-2">Receipt Hash</p>
                                    <p className="text-sm font-mono text-emerald-800 break-all bg-white px-3 py-2 rounded border">
                                        {receiptHash}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                        <div className="text-center mb-4">
                            <p className="text-sm text-gray-600">
                                This receipt has been digitally verified through StudentPay platform
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => router.push('/payment/pay/verify-receipt')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                            >
                                Verify Another Receipt
                            </button>
                            <a
                                href="/"
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors text-center"
                            >
                                Go to Homepage
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}