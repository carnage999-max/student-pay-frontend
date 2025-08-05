// app/lib/logout.ts
export async function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('department_id');
  window.location.href = '/department/login';
}
