'use client';

import { useEffect, useState } from 'react';

import { useRouter, usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    UserPlus,
    BookOpen,
    TrendingUp,
    ShieldCheck,
    LogOut,
    Menu,
    X,
    Users
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // Check for direct bypass
            if (localStorage.getItem('admin_bypass') === 'true') {
                setLoading(false);
                return;
            }

            try {
                // Strict Isolation: Check auth via server API
                const res = await fetch('/api/admin/check-auth');
                if (!res.ok) throw new Error('Auth verification failed');

                const data = await res.json();
                if (!data.authenticated) {
                    router.replace('/');
                    return;
                }
                setLoading(false);
            } catch (error) {
                console.error('Auth check error', error);
                router.replace('/');
            }
        };

        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <main suppressHydrationWarning style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a051a' }}>
                <div suppressHydrationWarning className="glass" style={{ padding: '40px', borderRadius: '24px' }}>
                    <p className="gold-gradient" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Loading SLG Control Plane...</p>
                </div>
            </main>
        );
    }

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/staff/create', label: 'Create Staff', icon: UserPlus },
        { href: '/admin/staff/manage', label: 'Manage Staff', icon: Users },
        { href: '/admin/schemes', label: 'Schemes', icon: BookOpen },
        { href: '/admin/market-rates', label: 'Market Rates', icon: TrendingUp },
        { href: '/admin/customer-access', label: 'Customer Access', icon: ShieldCheck },
    ];

    return (
        <div suppressHydrationWarning className="flex min-h-screen bg-[#0a051a] overflow-hidden">
            {/* Sidebar */}
            <aside
                suppressHydrationWarning
                className={`glass border-r border-white/10 transition-all duration-500 overflow-hidden flex flex-col ${isSidebarOpen ? 'w-72' : 'w-20'
                    }`}
                style={{ borderRadius: 0, background: 'rgba(255,255,255,0.02)' }}
            >
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen && (
                        <h2 className="text-xl font-black gold-gradient tracking-tighter">SLG COMMAND</h2>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 p-3.5 rounded-xl transition-all group ${isActive
                                    ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/10'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon size={22} className={isActive ? 'text-black' : 'group-hover:text-yellow-500 transition-colors'} />
                                {isSidebarOpen && (
                                    <span className="font-bold text-sm uppercase tracking-wider">{item.label}</span>
                                )}
                            </a>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={() => {
                            localStorage.removeItem('admin_bypass');
                            // Sign out logic should ideally call server API too
                            fetch('/api/auth/signout');
                            router.push('/');
                        }}
                        className={`flex items-center gap-4 w-full p-4 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-all font-bold ${isSidebarOpen ? '' : 'justify-center'}`}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="uppercase tracking-widest text-xs">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main suppressHydrationWarning style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
