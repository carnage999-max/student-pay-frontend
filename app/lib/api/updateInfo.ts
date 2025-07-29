// app/lib/api.ts
export async function updateDepartmentInfo(data: any, token: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/department/update-profile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error("Failed to update profile");
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}
