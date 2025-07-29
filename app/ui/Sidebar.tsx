'use client'

import { PowerIcon, MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import NavLinks from '@/app/ui/nav-links';
import { logout } from '@/app/lib/auth/logout';
import { useEffect, useState } from 'react';

export default function SideNav() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    return (
        <div className="md:flex md:flex-col md:h-screen md:w-64 bg-gray-50 border-r">
            {/* Mobile menu button */}
            <div className="flex items-center justify-between px-4 py-3 md:hidden">
                <button onClick={() => setOpen(!open)} className="text-gray-700">
                    {open ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                </button>
            </div>

            {/* Navigation menu */}
            <div className={`${open ? 'block' : 'hidden'} md:block px-4 py-2`}>
                <Link
                    href="/"
                    className="block py-3 text-blue-600 font-semibold"
                >
                    Dashboard
                </Link>

                <NavLinks />

                {isAuthenticated && (
                    <button
                        onClick={logout}
                        className="mt-4 flex items-center gap-2 text-sm text-red-600 hover:text-red-800"
                    >
                        <PowerIcon className="h-5 w-5" />
                        <span>Sign Out</span>
                    </button>
                )}
            </div>
        </div>
    );
}
