'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { updateDepartmentInfo } from "@/app/lib/api/updateInfo";
import { fetchDepartmentById } from "@/app/lib/api/departments";
import { useAuthGuard } from "../lib/hooks/useAuth";

const profileSchema = z.object({
    dept_name: z.string().min(2, "Department name is required"),
    bank_name: z.string().min(2, "Bank name is required"),
    account_number: z.string().length(10, "Account number must be 10 digits"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function DepartmentProfilePage() {
    useAuthGuard();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    const [token, setToken] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [accountName, setAccountName] = useState("");

    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [presidentSig, setPresidentSig] = useState<File | null>(null);
    const [presidentSigPreview, setPresidentSigPreview] = useState<string | null>(null);
    const [secretarySig, setSecretarySig] = useState<File | null>(null);
    const [secretarySigPreview, setSecretarySigPreview] = useState<string | null>(null);
    const [banks, setBanks] = useState<{ name: string; code: string }[]>([]);

    useEffect(() => {
        const storedToken = localStorage.getItem("access_token");
        if (storedToken) setToken(storedToken);

        const id = localStorage.getItem("department_id");
        if (!id) return;

        const fetchData = async () => {
            try {
                const bankRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/list-banks/`);
                const bankData = await bankRes.json();
                const uniqueBanks: unknown[] = Array.from(
                    new Map(bankData.map((bank: any) => [bank.name, bank])).values()
                );
                setBanks(uniqueBanks as { name: string; code: string; }[]);

                const data = await fetchDepartmentById(id);
                reset({
                    dept_name: data?.dept_name || "",
                    bank_name: data?.bank_name || "",
                    account_number: data?.account_number || "",
                });

                setAccountName(data?.account_name || "");
                setLogoPreview(data?.logo_url || null);
                setPresidentSigPreview(data?.president_signature_url || null);
                setSecretarySigPreview(data?.secretary_signature_url || null);
            } catch (err) {
                console.error("Failed to fetch department info or banks", err);
            }
        };

        fetchData();
    }, [reset]);

    const onSubmit = async (formData: ProfileFormData) => {
        try {
            const payload = new FormData();
            payload.append("dept_name", formData.dept_name);
            payload.append("bank_name", formData.bank_name);
            payload.append("account_number", formData.account_number);
            if (logo) payload.append("logo", logo);
            if (presidentSig) payload.append("president_signature_url", presidentSig);
            if (secretarySig) payload.append("secretary_signature_url", secretarySig);

            await updateDepartmentInfo(payload, token);
            setShowModal(true);
            window.location.reload();
        } catch (err) {
            alert("Error updating info");
        }
    };

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<File | null>>,
        previewSetter: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setter(file);
            previewSetter(URL.createObjectURL(file));
        }
    };

    const renderImageUploader = (
        label: string,
        currentPreview: string | null,
        setter: React.Dispatch<React.SetStateAction<File | null>>,
        previewSetter: React.Dispatch<React.SetStateAction<string | null>>
    ) => (
        <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">{label}</p>
            <label className="relative block w-28 h-28 border border-emerald-300 rounded-md overflow-hidden cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]">
                <img
                    src={currentPreview ?? "/placeholder.png"}
                    alt={`${label} Preview`}
                    className="w-full h-full object-cover"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setter, previewSetter)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
            </label>
        </div>
    );

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border border-gray-200">
                <h1 className="text-2xl font-bold mb-6 text-black-600 text-center">
                    Update Department Profile
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Department Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                        <input
                            {...register("dept_name")}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        {errors.dept_name && (
                            <p className="text-red-500 text-sm">{errors.dept_name.message}</p>
                        )}
                    </div>

                    {/* Bank Name */}
                    <div className="relative inline-block text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                        <select
                            {...register("bank_name")}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Select a bank</option>
                            {banks.map((bank) => (
                                <option key={`${bank.code}-${bank.name}`} value={bank.name}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                        {errors.bank_name && (
                            <p className="text-red-500 text-sm">{errors.bank_name.message}</p>
                        )}
                    </div>

                    {/* Account Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                        <input
                            {...register("account_number")}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        {errors.account_number && (
                            <p className="text-red-500 text-sm">{errors.account_number.message}</p>
                        )}
                    </div>

                    {/* Account Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                        <input
                            value={accountName}
                            disabled
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-gray-100"
                        />
                    </div>

                    {/* Image Uploaders */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                        {renderImageUploader("Logo", logoPreview, setLogo, setLogoPreview)}
                        {renderImageUploader("President Signature", presidentSigPreview, setPresidentSig, setPresidentSigPreview)}
                        {renderImageUploader("Secretary Signature", secretarySigPreview, setSecretarySig, setSecretarySigPreview)}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm py-2.5 transition"
                    >
                        {isSubmitting ? "Updating..." : "Update Profile"}
                    </button>
                </form>
            </div>

            {/* Success Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center">
                        <h2 className="text-lg font-bold text-emerald-600 mb-2">Success!</h2>
                        <p className="mb-4 text-gray-600">Your department info was updated.</p>
                        <button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
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
