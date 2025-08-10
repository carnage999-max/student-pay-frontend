export async function fetchPayments() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
        const response = await fetch(`${baseUrl}/pay/pay/?page=3`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch payments");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching payments:", error);
        return [];
    }
}
