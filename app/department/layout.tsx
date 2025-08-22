'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import {
    Home,
    PlusCircle,
    Settings,
    LogOut,
    LogIn,
    UserPlus,
    Menu,
    X,
    LayoutDashboard,
    HandCoins,
} from 'lucide-react';
import clsx from 'clsx';
import { url } from 'inspector';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DepartmentLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [deptName, setDeptName] = useState<string | null>(null);
    const [deptLogo, setDeptLogo] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState<number>(0);

    // read auth state once on mount
    useEffect(() => {
        const token = localStorage.getItem('access_token') || localStorage.getItem('token');
        setIsAuthenticated(!!token);

        const id = localStorage.getItem('department_id');
        if (id && token && BASE_URL) {
            (async () => {
                try {
                    const res = await fetch(`${BASE_URL}/accounts/department/${id}/`, {
                        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                    });
                    if (!res.ok) throw new Error('Failed to fetch department');
                    const json = await res.json();
                    setDeptName(json.dept_name ?? json.department_name ?? null);
                    setDeptLogo(json.logo_url ?? json.logo ?? null);
                } catch (err) {
                    console.error('department fetch failed', err);
                }
            })();

            // unread count (best-effort)
            (async () => {
                try {
                    const res = await fetch(`${BASE_URL}/pay/pay/?status=pending&page_size=1`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('access_token') || ''}` },
                    });
                    if (!res.ok) return;
                    const json = await res.json();
                    if (typeof json.count === 'number') setUnreadCount(json.count);
                } catch (err) {
                    // ignore
                }
            })();
        }
    }, []);

    const authNavItems = [
        { href: '/', label: 'Home', icon: <Home size={18} /> },
        { href: '/department/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { href: '/department/payments', label: 'Payments(Dues)', icon: <HandCoins size={18} /> },
        { href: '/department', label: 'Manage Info', icon: <Settings size={18} /> },
    ];

    const unauthNavItems = [
        { href: '/', label: 'Home', icon: <Home size={18} /> },
        { href: '/department/login', label: 'Login', icon: <LogIn size={18} /> },
        { href: '/department/signup', label: 'Sign up', icon: <UserPlus size={18} /> },
    ];

    const isActive = (href: string) =>
        pathname === href;

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('department_id');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        router.push('/');
    };


    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-800">
            {/* Mobile top header */}
            <header className="md:hidden w-full bg-white shadow-sm flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <Link href="/department" className="flex items-center gap-3">
                        {deptLogo ? (
                            <img src={deptLogo} alt="Dept Logo" className="w-8 h-8 rounded-full object-cover border" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
                                D
                            </div>
                        )}
                        <span className="font-semibold text-sm">{deptName ?? 'Dept Panel'}</span>
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="text-sm text-red-600 px-2 py-1 rounded hover:bg-emerald-50"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link href="/department/login" className="text-sm text-emerald-600">Login</Link>
                    )}
                </div>
            </header>
            <aside className="hidden md:block w-full md:w-64 bg-white shadow-md px-4 py-6 md:min-h-screen transition-all">
                <div className="flex items-center gap-3 mb-6">
                    {deptLogo ? (
                        <img src={deptLogo} alt="Dept Logo" className="w-12 h-12 rounded-full object-cover border" />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">D</div>
                    )}
                    <div>
                        <div className="font-semibold text-lg">{deptName ?? 'StudentPay'}</div>
                        {isAuthenticated ? <div className="text-sm text-gray-500">Department</div> : <div className="text-sm text-gray-500">Welcome, Guest!</div>}
                    </div>
                </div>

                <nav className="flex flex-col gap-2">
                    {isAuthenticated ? (
                        <>
                            {authNavItems.map(({ href, label, icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={clsx(
                                        'flex items-center gap-3 px-3 py-2 rounded-md',
                                        isActive(href) ? 'bg-emerald-100 text-emerald-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                                    )}
                                >
                                    {icon}
                                    <span>{label}</span>
                                    {href.includes('payments') && unreadCount > 0 && (
                                        <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-600 text-white">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>
                            ))}

                            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 mt-6 text-red-600 hover:text-red-800 rounded-md">
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            {unauthNavItems.map(({ href, label, icon }) => (
                                <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2 text-emerald-600 hover:bg-emerald-50 rounded-md">
                                    {icon}
                                    <span>{label}</span>
                                </Link>
                            ))}
                        </>
                    )}
                </nav>
            </aside>

            {/* Main content (padding bottom for mobile bottom nav) */}
            <main className="flex-1 p-4 pb-28 md:pb-4">{children}</main>

            {/* MOBILE BOTTOM NAV */}
            {isAuthenticated && (
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-transparent shadow-inner z-40">
                    <div className="max-w-5xl mx-auto px-4">
                        <div className="flex justify-between items-center">
                            {(isAuthenticated ? authNavItems : []).map(({ href, label, icon }) => {
                                const active = isActive(href);
                            const showBadge = href.includes('payments') && unreadCount > 0;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setDrawerOpen(false)}
                                    className={clsx(
                                        'flex-1 py-2 px-2 flex flex-col items-center justify-center text-xs',
                                        active ? 'text-emerald-600' : 'text-gray-500'
                                    )}
                                    title={label}
                                >
                                    <div className="relative">
                                        {icon}
                                        {showBadge && (
                                            <span className="absolute -top-2 -right-3 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-600 text-white">
                                                {unreadCount > 99 ? '99+' : unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <div className="truncate mt-1">{label}</div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>
            )}
            
        </div>
    );
}
