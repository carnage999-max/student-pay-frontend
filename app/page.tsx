'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAccessToken } from '@/app/lib/auth/token';
import { useRouter } from 'next/navigation';
import { logout } from './lib/auth/logout';
import { refreshAccessToken } from './lib/auth/refresh';
import {
  CreditCard,
  User,
  FileText,
  CheckCircle,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [deptName, setDeptName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Auth check
    const checkAuth = async () => {
      const token = getAccessToken();
      if (!token) return;

      try {
        await refreshAccessToken();
        const id = localStorage.getItem('department_id');
        if (!id) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/department/${id}`);

        if (res.ok) {
          const data = await res.json();
          setLoggedIn(true);
          setUserEmail(data.email || '');
          setDeptName(data.dept_name || '');
          setLogoUrl(data.logo_url || '');
        }
      } catch (err) {
        console.error('Auth check failed', err);
      }
    };

    checkAuth();

    // Onboarding: show if user hasn't opted out
    const seen = localStorage.getItem('studentpay_seen_onboarding');
    if (!seen) {
      // small delay so the page settles, nicer UX
      setTimeout(() => setShowOnboarding(true), 350);
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.refresh();
  };

  const closeOnboarding = (dontShow: boolean = false) => {
    setShowOnboarding(false);
    if (dontShow) {
      localStorage.setItem('studentpay_seen_onboarding', '1');
      setDontShowAgain(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-indigo-50 px-4 flex flex-col">
      {/* Top nav when logged in */}
      {loggedIn && (
        <nav className="w-full flex items-center justify-between py-3 px-6 bg-emerald-600 shadow-md">
          <div className="flex items-center gap-4">
            {logoUrl ? (
              <Link href="/department" className="block">
                <img
                  src={logoUrl}
                  alt="Department Logo"
                  className="w-10 h-10 object-cover rounded-full border-2 border-white"
                />
              </Link>
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold">
                {deptName?.[0] ?? 'D'}
              </div>
            )}

            <div className="text-sm text-white">
              <div className="font-semibold leading-4">{deptName || 'Your Department'}</div>
              <div className="text-xs opacity-90">Logged in as <strong>{userEmail || 'you'}</strong></div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/department"
              className="hidden sm:inline-flex items-center gap-2 bg-white/10 text-white px-3 py-1.5 rounded-md text-sm hover:bg-white/20"
            >
              <Sparkles className="w-4 h-4" /> Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-white hover:text-red-200 transition"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </nav>
      )}

      {/* Main hero */}
      <main className="flex-1 flex flex-col justify-center items-center py-12">
        <div className="w-full max-w-5xl text-center px-4">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-700 mb-3 drop-shadow-sm">
              Welcome to StudentPay <span className="inline-block transform translate-y-0.5">🎓</span>
            </h1>

            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Pay departmental fees online and get an instant, downloadable receipt.
              Students don’t need an account — department managers sign in to manage payments and view transactions.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex gap-4 flex-col sm:flex-row justify-center items-stretch mt-6">
            <Link
              href="/department/departments"
              className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md font-semibold shadow-md transition w-full sm:w-auto justify-center"
              aria-describedby="pay-desc"
            >
              <CreditCard className="w-5 h-5" />
              <span>Make a Payment</span>
              <ChevronRight className="w-4 h-4 opacity-80" />
            </Link>

            <Link
              href={loggedIn ? "/department" : "/department/login"}
              className="flex items-center gap-3 bg-white/90 hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-md font-medium shadow-sm transition w-full sm:w-auto justify-center"
              aria-describedby="dept-desc"
            >
              <User className="w-5 h-5 text-emerald-600" />
              <span>{loggedIn ? "Profile" : "Department Login"}</span>
            </Link>
          </div>

          {/* Explanations under CTAs */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
            <div id="pay-desc" className="bg-gradient-to-r from-white to-emerald-50 border-l-4 border-emerald-600 rounded-md p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-emerald-700 mb-1 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> For students
              </h3>
              <p className="text-sm text-gray-600">
                Click <strong>Make a Payment</strong>, pick your department and the fee type, enter your name and email, then follow secure checkout. You’ll get an instant receipt.
              </p>
            </div>

            <div id="dept-desc" className="bg-gradient-to-r from-white to-indigo-50 border-l-4 border-indigo-500 rounded-md p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-indigo-600 mb-1 flex items-center gap-2">
                <FileText className="w-4 h-4" /> For department managers
              </h3>
              <p className="text-sm text-gray-600">
                {loggedIn
                  ? 'Manage payments, update bank details and download receipts from your dashboard.'
                  : 'Click Department Login to sign in and create fees, connect a bank account and view transactions.'}
              </p>
            </div>
          </div>

          {/* Step guide */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2 bg-white border rounded p-4 items-start">
              <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                <CheckCircle className="w-5 h-5" /> Select
              </div>
              <div className="text-sm text-gray-600">Choose your department and the fee item to pay.</div>
            </div>

            <div className="flex flex-col gap-2 bg-white border rounded p-4 items-start">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                <CreditCard className="w-5 h-5" /> Pay
              </div>
              <div className="text-sm text-gray-600">You’ll be redirected to Paystack. Card details aren’t stored here.</div>
            </div>

            <div className="flex flex-col gap-2 bg-white border rounded p-4 items-start">
              <div className="flex items-center gap-2 text-amber-600 font-semibold">
                <FileText className="w-5 h-5" /> Receipt
              </div>
              <div className="text-sm text-gray-600">Get a downloadable receipt immediately after payment.</div>
            </div>
          </div>

          {/* Onboarding small CTA */}
          <div className="mt-8">
            <button
              onClick={() => setShowOnboarding(true)}
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:underline"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" /> How it works
            </button>
          </div>

          {/* FAQ */}
          <details className="mt-8 max-w-2xl mx-auto text-left">
            <summary className="cursor-pointer text-sm font-medium text-gray-800">Got questions? (click)</summary>
            <div className="mt-3 text-sm text-gray-600 space-y-2">
              <p><strong>Do students need an account?</strong> No — students don’t create accounts to pay.</p>
              <p><strong>Can I get a refund?</strong> Refunds are handled by departments — contact the department using info on your receipt.</p>
              <p><strong>Is payment secure?</strong> Payments are processed by Paystack; we only store transaction metadata and receipts.</p>
            </div>
          </details>
        </div>
      </main>
      {/* Onboarding Modal */}
      {showOnboarding && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/40"
            onClick={() => closeOnboarding(dontShowAgain)}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 transform transition-all text-black">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <CreditCard className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">How to pay (quick)</h3>
                    <p className="text-sm text-gray-600">3 simple steps — fast and secure.</p>
                  </div>
                </div>

                <button
                  onClick={() => closeOnboarding(dontShowAgain)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close onboarding"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium">Choose department & fee</div>
                    <div className="text-sm text-gray-600">Select the right department and the fee item to pay.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-medium">Complete payment</div>
                    <div className="text-sm text-gray-600">You’ll be redirected to Paystack to finish securely.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <FileText className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-medium">Get your receipt</div>
                    <div className="text-sm text-gray-600">Receipt is generated and available to view or download immediately.</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Don’t show this again
                </label>

                <div className="flex gap-2">
                  <button
                    onClick={() => closeOnboarding(dontShowAgain)}
                    className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Close
                  </button>
                  <Link
                    href="/department/departments"
                    onClick={() => {
                      if (dontShowAgain) localStorage.setItem('studentpay_seen_onboarding', '1');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                  >
                    Start Paying
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
