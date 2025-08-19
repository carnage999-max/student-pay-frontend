import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function Page() {
    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}