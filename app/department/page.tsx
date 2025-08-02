'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { updateDepartmentInfo } from "@/app/lib/api/updateInfo";
import { fetchDepartmentById } from "@/app/lib/api/departments";

const profileSchema = z.object({
    departmentName: z.string().min(2, "Department name is required"),
    bankName: z.string().min(2, "Bank name is required"),
    accountNumber: z.string().length(10, "Account number must be 10 digits"),
    accountName: z.string().min(2, "Account name is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function DepartmentProfilePage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset, // <-- used to prefill form
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    const [showModal, setShowModal] = useState(false);
    const [token, setToken] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem("token");
        if (stored) {
            setToken(stored);
        }
    }, []);

    useEffect(() => {
        const id = localStorage.getItem("department_id");
        if (id) {
            fetchDepartmentById(id)
                .then((data) => {
                    reset({
                        departmentName: data?.dept_name || "",
                        bankName: data?.bank_name || "",
                        accountNumber: data?.account_number || "",
                        accountName: data?.account_name || "",
                    });
                })
                .catch((err) => console.error("Failed to fetch department info", err));
        }
    }, [reset]);

    const onSubmit = async (data: ProfileFormData) => {
        try {
            await updateDepartmentInfo(data, token);
            setShowModal(true);
        } catch (err) {
            alert("Error updating info");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border border-gray-200">
                <h1 className="text-2xl font-bold mb-4">Update Department Profile</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* form fields remain unchanged */}
                    <div>
                        <label className="block text-sm font-medium">Department Name</label>
                        <input
                            {...register("departmentName")}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.departmentName && (
                            <p className="text-red-500 text-sm">{errors.departmentName.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Bank Name</label>
                        <input
                            {...register("bankName")}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.bankName && (
                            <p className="text-red-500 text-sm">{errors.bankName.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Account Number</label>
                        <input
                            {...register("accountNumber")}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.accountNumber && (
                            <p className="text-red-500 text-sm">{errors.accountNumber.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Account Name</label>
                        <input
                            {...register("accountName")}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled
                        />
                        {errors.accountName && (
                            <p className="text-red-500 text-sm">{errors.accountName.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 transition"
                    >
                        {isSubmitting ? "Updating..." : "Update Profile"}
                    </button>
                </form>
            </div>

            {/* Success Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-80 text-center">
                        <h2 className="text-lg font-bold mb-2">Success!</h2>
                        <p className="mb-4">Your department info was updated.</p>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            onClick={() => setShowModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
