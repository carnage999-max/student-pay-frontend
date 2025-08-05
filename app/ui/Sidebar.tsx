'use client'

import { PowerIcon, MenuIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import NavLinks from '@/app/ui/nav-links'
import { logout } from '@/app/lib/auth/logout'
import { useEffect, useState } from 'react'
import {
    BUTTON_SECONDARY,
    CONTAINER,
    TITLE
} from '@/app/ui/constants' // Make sure this is the correct path to your constants

export default function SideNav() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        setIsAuthenticated(!!token)
    }, [])

    return (
        <aside className="md:flex md:flex-col md:h-screen md:w-64 border-r bg-white shadow-sm">
            {/* Mobile menu button */}
            <div className="flex items-center justify-between px-4 py-3 md:hidden border-b">
                <button
                    onClick={() => setOpen(!open)}
                    className="text-emerald-600 focus:outline-none"
                >
                    {open ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                </button>
                <span className={`${TITLE}`}>Menu</span>
            </div>

            {/* Navigation */}
            <div className={`${open ? 'block' : 'hidden'} md:block p-4`}>
                <Link
                    href="/"
                    className="block mb-4 text-emerald-600 hover:text-emerald-700 font-semibold text-base"
                >
                    Dashboard
                </Link>

                <NavLinks />

                {isAuthenticated && (
                    <button
                        onClick={logout}
                        className="mt-6 flex items-center gap-2 text-sm text-red-600 hover:text-red-800"
                    >
                        <PowerIcon className="h-5 w-5" />
                        <span>Sign Out</span>
                    </button>
                )}
            </div>
        </aside>
    )
}
