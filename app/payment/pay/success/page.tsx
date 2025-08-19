import { Suspense } from "react";
import PaymentSuccessContent from "./PaymentSuccessContent";

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-[50vh]"><p className="text-gray-700 text-lg">Loading...</p></div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}