import { Suspense } from "react";
import PaymentsContent from "./PaymentsContent";

export default function PaymentsPage() {
    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <PaymentsContent />
        </Suspense>
    );
}