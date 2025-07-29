const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchPaymentsByDepartment() {
    const res = await fetch(`${BASE_URL}/pay/payment/`);
    if (!res.ok) throw new Error('Failed to fetch payments');
    let response = res.json();
    return response;
}

export async function fetchPaymentById(payment_id: string) {
    const res = await fetch(`${BASE_URL}/pay/payment/${payment_id}/`);
    if (!res.ok) throw new Error('Failed to fetch payment');
    return res.json();
}


export async function initiatePayment(data: {
    customer_email: string;
    first_name: string;
    last_name: string;
    payment: string;
    department: string;
}) {
    console.log(JSON.stringify(data));
    const res = await fetch(`${BASE_URL}/pay/pay/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Payment initiation failed');
    let response = res.json();
    return response;
}
