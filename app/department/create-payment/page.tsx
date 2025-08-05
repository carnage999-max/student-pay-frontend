'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPayment } from '@/app/lib/api/createPayment';
import Modal from '@/app/ui/Modal';
import { BUTTON_PRIMARY, INPUT, LABEL, TITLE } from '@/app/ui/constants';
import { useAuthGuard } from '@/app/lib/hooks/useAuth';

const PaymentSchema = z.object({
    payment_for: z.string().min(1, "Payment title is required"),
    amount_due: z.string().min(1, "Amount is required"),
});

type PaymentForm = z.infer<typeof PaymentSchema>;

export default function CreatePaymentPage() {
    useAuthGuard();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<PaymentForm>({
        resolver: zodResolver(PaymentSchema),
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [responseMsg, setResponseMsg] = useState('');

    const onSubmit = async (data: PaymentForm) => {
        const token = localStorage.getItem('access_token');
        const res = await createPayment(data, token);

        if (res.success) {
            setResponseMsg('Payment created successfully!');
            setModalOpen(true);
            reset();
        } else {
            setResponseMsg(res.message || 'An error occurred');
            setModalOpen(true);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border border-gray-200">
                <h2 className={TITLE}>Create Payment</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className={LABEL}>Payment Title</label>
                        <input
                            type="text"
                            {...register('payment_for')}
                            className={INPUT}
                        />
                        {errors.payment_for && (
                            <p className="text-red-600 text-sm">{errors.payment_for.message}</p>
                        )}
                    </div>

                    <div>
                        <label className={LABEL}>Amount Expected (₦)</label>
                        <input
                            type="number"
                            {...register('amount_due')}
                            className={INPUT}
                        />
                        {errors.amount_due && (
                            <p className="text-red-600 text-sm">{errors.amount_due.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={BUTTON_PRIMARY}
                    >
                        {isSubmitting ? 'Submitting...' : 'Create Payment'}
                    </button>
                </form>
            </div>

            {modalOpen && (
                <Modal message={responseMsg} onClose={() => setModalOpen(false)} />
            )}
        </div>
    );
}
