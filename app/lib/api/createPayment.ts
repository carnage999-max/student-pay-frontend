export async function createPayment(data: any, token: string | null) {
    data.department = localStorage.getItem('department_id');
    console.log(JSON.stringify(data));
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/payment/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok) {
            return { success: false, message: result.detail || 'Failed to create payment' };
        }

        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
}
