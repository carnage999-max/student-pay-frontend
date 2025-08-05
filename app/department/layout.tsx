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
    UserPlusIcon,
    Menu,
    X,
} from 'lucide-react';

export default function DepartmentLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsAuthenticated(!!token);
    }, []);

    const navItems = [
        { href: '/department/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
        { href: '/department/create-payment', label: 'Create Payment', icon: <PlusCircle size={18} /> },
        { href: '/department', label: 'Manage Info', icon: <Settings size={18} /> },
    ];

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-800">
            {/* Mobile Header */}
            <div className="flex items-center justify-between md:hidden p-4 shadow bg-white">
                <h2 className="text-xl font-bold">
                    <Link key={'/'} href={'/'}>Dept Panel</Link>
                </h2>
                <button onClick={toggleSidebar} className="text-gray-700">
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'block' : 'hidden'
                    } md:block w-full md:w-64 bg-white shadow-md px-4 py-6 md:min-h-screen transition-all duration-300`}
            >
                <h2 className="text-xl font-bold mb-6 hidden md:block">
                    <Link key={'/'} href={'/'}>Dept Panel</Link>
                </h2>
                <nav className="space-y-3">
                    {isAuthenticated ? (
                        <>
                            {navItems.map(({ href, label, icon }) => {
                                const isActive = pathname === href;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        {icon}
                                        {label}
                                    </Link>
                                );
                            })}
                            <button
                                onClick={() => {
                                    localStorage.removeItem('access_token');
                                    localStorage.removeItem('refresh_token');
                                    localStorage.removeItem('department_id');
                                    window.location.href = '/department/login';
                                }}
                                className="sidebar-link flex items-center gap-2 mt-6 text-red-600 hover:text-red-800 w-full"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/department/login"
                                className="flex items-center gap-2 mt-6 text-emerald-600 hover:underline"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <LogIn size={18} /> Login
                            </Link>

                            <Link
                                href="/department/signup"
                                className="flex items-center gap-2 mt-6 text-emerald-600 hover:underline"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <UserPlusIcon size={18} /> Sign up
                            </Link>
                        </>
                    )}
                </nav>

            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4">{children}</main>
        </div>
    );
}
