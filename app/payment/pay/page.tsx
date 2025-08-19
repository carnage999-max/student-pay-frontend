// app/payment/pay/page.tsx
import { Suspense } from "react";
import PaymentFormContent from "./PaymentFormContent";

export default function PaymentFormPage() {
    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <PaymentFormContent />
        </Suspense>
    );
}