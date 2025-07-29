"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import {
    Home,
    PlusCircle,
    Settings,
    LogOut,
    LogIn,
    Menu,
    X,
} from "lucide-react";

export default function DepartmentLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const navItems = [
        { href: "/department/dashboard", label: "Dashboard", icon: <Home size={18} /> },
        { href: "/department/create-payment", label: "Create Payment", icon: <PlusCircle size={18} /> },
        { href: "/department", label: "Manage Info", icon: <Settings size={18} /> },
    ];

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-800">
            {/* Mobile Header */}
            <div className="flex items-center justify-between md:hidden p-4 shadow bg-white">
                <h2 className="text-xl font-bold">Dept Panel</h2>
                <button onClick={toggleSidebar} className="text-gray-700">
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? "block" : "hidden"
                    } md:block w-full md:w-64 bg-white shadow-md px-4 py-6 md:min-h-screen transition-all duration-300`}
            >
                <h2 className="text-xl font-bold mb-6 hidden md:block">Dept Panel</h2>
                <nav className="space-y-3">
                    {navItems.map(({ href, label, icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-2 px-2 py-2 rounded hover:text-blue-600 hover:bg-blue-50 ${pathname === href ? "bg-blue-100 text-blue-700 font-medium" : ""
                                }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            {icon}
                            {label}
                        </Link>
                    ))}

                    {isAuthenticated ? (
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                router.push("/department/login");
                            }}
                            className="flex items-center gap-2 mt-6 text-red-500 hover:underline"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    ) : (
                        <Link
                            href="/department/login"
                            className="flex items-center gap-2 mt-6 text-green-600 hover:underline"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <LogIn size={18} /> Login
                        </Link>
                    )}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4">{children}</main>
        </div>
    );
}
