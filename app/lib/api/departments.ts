const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchDepartments() {
    const res = await fetch(`${BASE_URL}/accounts/department/`);
    if (!res.ok) throw new Error('Failed to fetch departments');
    let response = res.json();
    console.log(response);
    return response;
}

export async function fetchDepartmentById(department_id: string) {
    const res = await fetch(`${BASE_URL}/accounts/department/${department_id}/`);
    if (!res.ok) throw new Error('Failed to fetch department');
    return res.json();
}
