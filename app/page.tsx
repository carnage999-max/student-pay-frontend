'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAccessToken } from '@/app/lib/auth/token';
import { useRouter } from 'next/navigation';
import { logout } from './lib/auth/logout';
import { refreshAccessToken } from './lib/auth/refresh';

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [deptName, setDeptName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();
      if (!token) return;

      try {
        await refreshAccessToken();
        const id = localStorage.getItem('department_id');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/department/${id}`);

        if (res.ok) {
          const data = await res.json();
          setLoggedIn(true);
          setUserEmail(data.email);
          setDeptName(data.dept_name);
          setLogoUrl(data.logo_url); // add this line
        }
      } catch (err) {
        console.error('Auth check failed', err);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
    router.refresh(); // reload current page
  };

  return (
    <div className="min-h-screen bg-white px-4 flex flex-col">
      {loggedIn && (
        <nav className="w-full flex items-center justify-between py-4 px-6 bg-emerald-600 border-b">
          <div className="flex items-center gap-4">
            {logoUrl && (
              <Link href={'/department'}>
                <img
                  src={logoUrl}
                  alt="Department Logo"
                  className="w-10 h-10 object-cover rounded-full border border-white"
                />
              </Link>
            )}
            <div className="text-sm text-white">
              <div className="font-semibold">{deptName}</div>
              <div>Logged in as <strong>{userEmail}</strong></div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-sm text-white hover:text-red-200 transition"
          >
            Logout
          </button>
        </nav>
      )}

      <main className="flex-1 flex flex-col justify-center items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-600 mb-4 text-center">
          Welcome to StudentPay
        </h1>

        <p className="text-gray-600 text-center max-w-xl mb-8">
          Seamless payment and receipt generation for university departments and students. Secure. Simple. Fast.
        </p>

        <div className="flex gap-6 flex-col sm:flex-row">
          <Link
            href={loggedIn ? "/department" : "/department/login"}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md font-medium text-center"
          >
            {loggedIn ? "Update Profile" : "Department Login"}
          </Link>
          {
            !loggedIn ? (
              <Link
                href="/department/payment"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium text-center"
              >
                Make a Payment
              </Link>
            ) : 
            <span></span>
          }
        </div>
      </main>
    </div>
  );
}
