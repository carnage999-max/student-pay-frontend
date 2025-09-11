"use client";

import { useState, useEffect } from "react";
import { Clock, Mail, MessageCircle, RefreshCw } from "lucide-react";
import { BUTTON_PRIMARY } from "@/app/ui/constants";
import { useVerificationGuard } from '@/app/lib/hooks/useAuth';


export default function VerificationPending() {
    useVerificationGuard();
    const [deptName, setDeptName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Get department name from localStorage or API call
        const fetchDeptInfo = async () => {
            try {
                const accessToken = localStorage.getItem("access_token");
                const departmentId = localStorage.getItem("department_id");

                if (!accessToken || !departmentId) {
                    window.location.href = "/department/login";
                    return;
                }

                // You might want to fetch department details here
                // For now, we can set a placeholder or fetch from your API
                setDeptName("Your Department"); // Replace with actual API call
            } catch (error) {
                console.error("Error fetching department info:", error);
            }
        };

        fetchDeptInfo();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("department_id");
        window.location.href = "/";
    };

    const checkVerificationStatus = async () => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem("access_token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/department/`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                console.log(data)
                if (data.is_verified) {
                    window.location.href = "/department";
                } else {
                    // Show a message that verification is still pending
                    alert("Your account is still under review. Please check back later.");
                }
            }
        } catch (error) {
            console.error("Error checking verification status:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-gray-200 p-8">
                {/* Status Icon */}
                <div className="text-center mb-6">
                    <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8 text-amber-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Account Under Review
                    </h1>
                    <p className="text-gray-600">
                        Your department registration is being verified
                    </p>
                </div>

                {/* Status Card */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-amber-800 mb-1">
                                Verification in Progress
                            </h3>
                            <p className="text-sm text-amber-700">
                                We're currently reviewing your department information and will notify you via email once approved.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-bold">✓</span>
                            </div>
                            <span className="text-sm text-gray-600">Application submitted</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center animate-pulse">
                                <Clock className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm text-gray-600">Admin review (24-48 hours)</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                <Mail className="w-3 h-3 text-gray-500" />
                            </div>
                            <span className="text-sm text-gray-600">Email notification sent</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-xs text-gray-500 font-bold">4</span>
                            </div>
                            <span className="text-sm text-gray-600">Access granted to dashboard</span>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-emerald-800 mb-2">Need Help?</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-emerald-600" />
                            <a href="mailto:studentpaydesk@proton.me" className="text-emerald-700 hover:underline">
                                studentpaydesk@proton.me
                            </a>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MessageCircle className="w-4 h-4 text-emerald-600" />
                            <a href="https://wa.me/2348163899213" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">
                                WhatsApp: +234 816 389 9213
                            </a>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={checkVerificationStatus}
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>{loading ? "Checking..." : "Check Status"}</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                    <p className="text-xs text-gray-500">
                        You'll receive an email notification once your account is approved
                    </p>
                </div>
            </div>
        </div>
    );
}