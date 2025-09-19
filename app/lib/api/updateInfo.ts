export async function updateDepartmentInfo(formData: FormData, token: string) {
    const dept_id = localStorage.getItem('department_id');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/department/${dept_id}/`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) throw new Error("Failed to update department info");
    return await res.json();
}
