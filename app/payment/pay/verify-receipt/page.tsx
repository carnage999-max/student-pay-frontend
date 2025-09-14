'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, AlertCircle, Clock, CreditCard, Building2, Hash } from 'lucide-react';

type VerificationResult = {
    status: string;
    transaction_id?: string;
    amount?: number;
    date?: string;
    department?: string;
};

export default function VerifyReceiptPage() {
    const searchParams = useSearchParams();
    const receiptHash = searchParams.get('hash');

    const [loading, setLoading] = useState(true);
    const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const verifyReceipt = async () => {
            if (!receiptHash) {
                setError('No receipt hash provided');
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/verify?hash=${receiptHash}`
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

        verifyReceipt();
    }, [receiptHash]);

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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 max-w-md w-full text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying receipt...</p>
                </div>
            </div>
        );
    }

    if (error || !receiptHash) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 max-w-md w-full text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
                    <p className="text-gray-600 mb-6">
                        {error || 'Invalid receipt link. Please scan a valid QR code.'}
                    </p>
                    <a
                        href="/"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
                    >
                        Go to Homepage
                    </a>
                </div>
            </div>
        );
    }

    if (!verificationResult || verificationResult.status !== 'valid') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Receipt Invalid</h1>
                    <p className="text-gray-600 mb-6">
                        This receipt could not be verified or does not exist in our system.
                    </p>
                    <a
                        href="/"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
                    >
                        Go to Homepage
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Success Header */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mb-6 text-center">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Receipt Verified</h1>
                    <p className="text-emerald-600 font-medium">
                        This is a valid payment receipt from StudentPay
                    </p>
                </div>

                {/* Receipt Details */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Transaction Receipt</h2>
                        <p className="text-gray-600">Payment Verification Details</p>
                    </div>

                    <div className="space-y-6">
                        {/* Transaction ID */}
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <Hash className="w-5 h-5 text-emerald-600" />
                                <p className="text-sm font-medium text-emerald-800">Transaction ID</p>
                            </div>
                            <p className="text-lg font-bold text-emerald-900 font-mono">{verificationResult.transaction_id}</p>
                        </div>

                        {/* Amount and Department */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                    <CreditCard className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-xs font-medium text-blue-800">Amount Paid</p>
                                        <p className="text-lg font-semibold text-blue-900">
                                            {formatCurrency(verificationResult.amount || 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                    <Building2 className="w-5 h-5 text-purple-600" />
                                    <div>
                                        <p className="text-xs font-medium text-purple-800">Department</p>
                                        <p className="text-lg font-semibold text-purple-900">{verificationResult.department}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Date */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                                <Clock className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className="text-xs font-medium text-gray-600">Payment Date & Time</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {verificationResult.date ? formatDate(verificationResult.date) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Receipt Hash */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <Hash className="w-5 h-5 text-gray-500 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-gray-600 mb-1">Receipt Hash</p>
                                    <p className="text-xs font-mono text-gray-800 break-all">{receiptHash}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                        <p className="text-xs text-gray-500 mb-4">
                            This receipt has been digitally verified through StudentPay platform
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a
                                href="/"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
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