export async function createPayment(data: any, token: string | null) {
    const department_id = localStorage.getItem('department_id');
    console.log(JSON.stringify(data));
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/department/${department_id}/payment/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        console.log(result);

        if (!res.ok) {
            return { success: false, message: result.detail || 'Failed to create payment' };
        }

        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
}
