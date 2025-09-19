"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BUTTON_SECONDARY } from "@/app/ui/constants";
import { ReactNode } from "react";
import { Suspense } from "react";

export default function PaymentLayout({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <PaymentLayoutContent>{children}</PaymentLayoutContent>
        </Suspense>
    );
}

function PaymentLayoutContent({ children }: { children: ReactNode }) {
    const searchParams = useSearchParams();
    const department_id = searchParams.get("department_id");
    const backLink = department_id ? `/department/departments/` : "/";

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-6">
            <div className="w-full max-w-4xl sm:max-w-3xl bg-white p-4 sm:p-8 rounded-2xl shadow-md border border-gray-200">
                <header className="flex items-center justify-between mb-4 sm:mb-6">
                    <h1 className="text-lg sm:text-2xl font-bold text-black">Student Payment Portal</h1>
                    <Link href={backLink} className={BUTTON_SECONDARY}>
                        ← Leave Payment
                    </Link>
                </header>
                <div className="bg-transparent shadow-none rounded-lg p-0 sm:p-6">{children}</div>
            </div>
        </div>
    );
}
