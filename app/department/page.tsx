'use client';

import { useEffect, useState } from "react";
import { fetchDepartmentById } from "@/app/lib/api/departments";
import { useAuthGuard } from "../lib/hooks/useAuth";
import { Mail, Phone, Building2, CreditCard, User, Shield, Eye, EyeOff } from "lucide-react";

type DepartmentInfo = {
    dept_name: string;
    email: string;
    bank_name: string;
    account_number: string;
    account_name: string;
    logo_url: string | null;
    president_signature_url: string | null;
    secretary_signature_url: string | null;
    is_verified: boolean;
};

export default function DepartmentInfoPage() {
    useAuthGuard();

    const [departmentInfo, setDepartmentInfo] = useState<DepartmentInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetPassword, setResetPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        logoutAll: false
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState("");
    const [resetSuccess, setResetSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = localStorage.getItem("department_id");
                if (!id) return;

                const data = await fetchDepartmentById(id);
                setDepartmentInfo(data);
            } catch (err) {
                console.error("Failed to fetch department info", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetError("");

        if (resetPassword.newPassword !== resetPassword.confirmPassword) {
            setResetError("New passwords do not match");
            return;
        }

        if (resetPassword.newPassword.length < 8) {
            setResetError("New password must be at least 8 characters");
            return;
        }

        setResetLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/change-password/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    old_password: resetPassword.currentPassword,
                    new_password: resetPassword.newPassword,
                    logout_all: resetPassword.logoutAll,
                }),
            });

            if (res.ok) {
                setResetSuccess(true);
                setResetPassword({ currentPassword: "", newPassword: "", confirmPassword: "", logoutAll: false });
                setTimeout(() => {
                    setShowResetModal(false);
                    setResetSuccess(false);
                }, 2000);
            } else {
                const data = await res.json();
                setResetError(data.message || "Failed to reset password");
            }
        } catch (err) {
            setResetError("Something went wrong");
        } finally {
            setResetLoading(false);
        }
    };

    const InfoCard = ({ icon: Icon, label, value, className = "" }: {
        icon: any;
        label: string;
        value: string;
        className?: string;
    }) => (
        <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
            <div className="flex items-start space-x-3">
                <div className="bg-emerald-100 p-2 rounded-lg">
                    <Icon className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
                    <p className="text-sm font-semibold text-gray-900 break-all">{value}</p>
                </div>
            </div>
        </div>
    );

    const ImageDisplay = ({ src, alt, label }: { src: string | null; alt: string; label: string }) => (
        <div className="text-center">
            <p className="text-xs font-medium text-gray-500 mb-2">{label}</p>
            <div className="w-20 h-20 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 mx-auto">
                <img
                    src={src || "/placeholder.png"}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-emerald-600">Loading department information...</div>
            </div>
        );
    }

    if (!departmentInfo) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-600">Failed to load department information</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <Building2 className="w-6 h-6 text-emerald-600" />
                        <h1 className="text-2xl font-bold text-gray-900">Department Information</h1>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                        <Shield className={`w-4 h-4 ${departmentInfo.is_verified ? 'text-emerald-600' : 'text-amber-600'}`} />
                        <span className={`text-sm font-medium ${departmentInfo.is_verified ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {departmentInfo.is_verified ? 'Verified Account' : 'Pending Verification'}
                        </span>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4 mb-8">
                    <InfoCard
                        icon={Building2}
                        label="Department Name"
                        value={departmentInfo.dept_name}
                    />
                    <InfoCard
                        icon={Mail}
                        label="Email Address"
                        value={departmentInfo.email}
                    />
                </div>

                {/* Banking Information */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center space-x-2">
                        <CreditCard className="w-5 h-5" />
                        <span>Banking Details</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoCard
                            icon={Building2}
                            label="Bank Name"
                            value={departmentInfo.bank_name}
                            className="bg-white"
                        />
                        <InfoCard
                            icon={CreditCard}
                            label="Account Number"
                            value={departmentInfo.account_number}
                            className="bg-white"
                        />
                    </div>
                    <div className="mt-4">
                        <InfoCard
                            icon={User}
                            label="Account Name"
                            value={departmentInfo.account_name || "Not available"}
                            className="bg-white"
                        />
                    </div>
                </div>

                {/* Images Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Assets</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <ImageDisplay
                            src={departmentInfo.logo_url}
                            alt="Department Logo"
                            label="Department Logo"
                        />
                        <ImageDisplay
                            src={departmentInfo.president_signature_url}
                            alt="President Signature"
                            label="President Signature"
                        />
                        <ImageDisplay
                            src={departmentInfo.secretary_signature_url}
                            alt="Secretary Signature"
                            label="Secretary Signature"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => setShowResetModal(true)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                        <Shield className="w-4 h-4" />
                        <span>Reset Password</span>
                    </button>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <Mail className="w-5 h-5 text-amber-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-amber-800">Need to update your information?</p>
                                <p className="text-sm text-amber-700 mt-1">
                                    Contact support at{" "}
                                    <a href="mailto:studentpaydesk@proton.me" className="underline">
                                        studentpaydesk@proton.me
                                    </a>
                                    {" "}or WhatsApp{" "}
                                    <a href="https://wa.me/2348163899213" className="underline">
                                        +234 816 389 9213
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reset Password Modal */}
            {showResetModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Reset Password</h2>

                        {resetSuccess ? (
                            <div className="text-center py-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Shield className="w-6 h-6 text-emerald-600" />
                                </div>
                                <p className="text-emerald-600 font-medium">Password updated successfully!</p>
                            </div>
                        ) : (
                            <form onSubmit={handlePasswordReset} className="space-y-4">
                                {resetError && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <p className="text-red-600 text-sm">{resetError}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.current ? "text" : "password"}
                                            value={resetPassword.currentPassword}
                                            onChange={(e) => setResetPassword({ ...resetPassword, currentPassword: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        >
                                            {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? "text" : "password"}
                                            value={resetPassword.newPassword}
                                            onChange={(e) => setResetPassword({ ...resetPassword, newPassword: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        >
                                            {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? "text" : "password"}
                                            value={resetPassword.confirmPassword}
                                            onChange={(e) => setResetPassword({ ...resetPassword, confirmPassword: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        >
                                            {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={resetPassword.logoutAll}
                                            onChange={(e) => setResetPassword({ ...resetPassword, logoutAll: e.target.checked })}
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Logout from all devices</span>
                                    </label>
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowResetModal(false);
                                            setResetError("");
                                            setResetPassword({ currentPassword: "", newPassword: "", confirmPassword: "", logoutAll: false });
                                        }}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={resetLoading}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {resetLoading ? "Updating..." : "Update Password"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}