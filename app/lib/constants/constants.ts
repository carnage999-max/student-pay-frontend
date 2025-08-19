// app/lib/constants/constants.ts
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
export const department_id = typeof window !== "undefined" ? localStorage.getItem("department_id") || "" : "";