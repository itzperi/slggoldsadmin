'use client';

import OfficeActionCard from '@/components/office/OfficeActionCard';
import { LogOut, LayoutDashboard, User, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function OfficeDashboard() {
    const router = useRouter();

    const handleSignOut = async () => {
        localStorage.removeItem('office_bypass');
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 selection:bg-orange-200">
            {/* Office Navbar */}
            <nav className="bg-white/80 backdrop-blur-xl border-b border-orange-100 px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black italic">SLG</div>
                        <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic">Office Desk</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col text-right">
                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest leading-none">Status</span>
                            <span className="text-sm font-bold text-slate-800">Operational</span>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 py-20">
                <header className="mb-16 space-y-2">
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight">
                        Daily Operations <span className="text-orange-500">🏢</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-lg">Manage enrollments, assignments, and payments with ease.</p>
                </header>

                {/* Office Actions - Larger Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <OfficeActionCard
                        title="Enroll New Customer"
                        desc="Start a new investment journey. Create profile and assign scheme instantly."
                        icon="👥"
                        href="/office/customers/add"
                    />
                    <OfficeActionCard
                        title="Staff Assignment"
                        desc="Link customers to field collection staff for seamless daily collections."
                        icon="🔗"
                        href="/office/assignments"
                    />
                    <OfficeActionCard
                        title="Record Payment"
                        desc="Process walk-in payments and office collection receipts manually."
                        icon="💵"
                        href="/office/payments"
                    />
                    <OfficeActionCard
                        title="Scheme Enrollment"
                        desc="Add additional gold or silver schemes to existing customer portfolios."
                        icon="📈"
                        href="/office/enrollments"
                    />
                    <OfficeActionCard
                        title="Withdrawal Queue"
                        desc="Manage customer payout requests and local status updates."
                        icon="💸"
                        href="/office/withdrawals"
                    />
                    <OfficeActionCard
                        title="Customer Access"
                        desc="Manage login credentials and system invitations for customers."
                        icon="📱"
                        href="/admin/customer-access"
                    />
                </div>
            </main>

            {/* Footer Support Pin */}
            <div className="fixed bottom-8 right-8">
                <div className="bg-white px-6 py-3 rounded-full shadow-2xl border border-orange-100 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                    <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Live Sync Active</span>
                </div>
            </div>
        </div>
    );
}
