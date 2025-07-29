// app/lib/logout.ts
export async function logout() {
  localStorage.removeItem('token'); // Remove JWT from localStorage
  window.location.href = '/department/login'; // Redirect to login
}
