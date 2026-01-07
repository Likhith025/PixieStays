'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { checkAuth, logoutAdmin } from '@/lib/api';
import { FiHome, FiGrid, FiList, FiEdit, FiLogOut, FiTag } from 'react-icons/fi';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const verify = async () => {
            const auth = await checkAuth();
            if (!auth.isAuthenticated) {
                router.push('/admin/login');
            } else {
                setIsAuthenticated(true);
            }
        };
        verify();
    }, [router]);

    const handleLogout = async () => {
        await logoutAdmin();
        router.push('/admin/login');
    };

    if (!isAuthenticated) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: FiHome },
        { name: 'Properties', href: '/admin/dashboard/properties', icon: FiGrid },
        { name: 'Bookings', href: '/admin/dashboard/bookings', icon: FiList },
        { name: 'Site Content', href: '/admin/dashboard/content', icon: FiEdit },
        { name: 'Social Media', href: '/admin/dashboard/links', icon: FiGrid },
        { name: 'Smart Coupons', href: '/admin/dashboard/coupons', icon: FiTag },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold font-heading text-primary">Pixie<span className="text-secondary">Admin</span></h1>
                </div>
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === item.href
                                ? 'bg-primary text-white'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon />
                            {item.name}
                        </Link>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-8"
                    >
                        <FiLogOut />
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
