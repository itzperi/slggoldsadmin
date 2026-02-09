'use client';

import { useEffect, useState } from 'react';

import MetricCard from '@/components/admin/MetricCard';
import ActionButton from '@/components/admin/ActionButton';
import FinancialChart from '@/components/admin/FinancialChart';
import { Bell, Search, User, Settings, ArrowUpRight, Activity } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        customers: 0,
        collections: 0,
        schemes: 18,
        withdrawals: 0
    });

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchStats();

        // POLL instead of Realtime for Strict Isolation
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-yellow-200">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between gap-8">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative group max-w-md w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search Command Center..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500/30 transition-all font-medium text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-slate-900 leading-none">MASTER ADMIN</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Super Authority</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#B8860B] shadow-lg shadow-yellow-500/20 flex items-center justify-center text-white ring-4 ring-white">
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-12 space-y-12">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            Executive Overview <span className="text-yellow-500">✨</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Nagercoil Production Node — Operational 24/7</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                            Export Ledger
                        </button>
                        <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                            Audit System
                        </button>
                    </div>
                </div>

                {/* Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <MetricCard
                        title="Total Customers"
                        value={stats.customers.toLocaleString()}
                        trend="+12.5%"
                        color="from-emerald-500 to-emerald-600"
                    />
                    <MetricCard
                        title="Gross Collections"
                        value={`₹${(stats.collections).toLocaleString()}`}
                        trend="+18.2%"
                        color="from-amber-400 to-amber-600"
                    />
                    <MetricCard
                        title="Active Schemes"
                        value={stats.schemes}
                        trend="+2.1%"
                        color="from-blue-500 to-indigo-600"
                    />
                    <MetricCard
                        title="Pending Payouts"
                        value={stats.withdrawals}
                        trend="-5.4%"
                        color="from-rose-500 to-red-600"
                    />
                </section>

                {/* Chart & Activity Section */}
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Financial Chart Wrapper */}
                        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/40">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                    <Activity className="text-yellow-500" size={20} />
                                    Wealth Inflow Projection
                                </h2>
                                <select className="bg-slate-50 border-none rounded-xl text-xs font-bold uppercase tracking-widest px-4 py-2 outline-none">
                                    <option>Last 30 Days</option>
                                    <option>Last 90 Days</option>
                                </select>
                            </div>
                            <div className="h-[400px]">
                                <FinancialChart />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 gap-6 h-full">
                            <ActionButton
                                icon="👥"
                                label="Customer HQ"
                                href="/admin/customer-access"
                                gradient="from-blue-500 to-indigo-700"
                            />
                            <ActionButton
                                icon="💰"
                                label="Scheme Vault"
                                href="/admin/schemes"
                                gradient="from-emerald-500 to-teal-700"
                            />
                            <ActionButton
                                icon="👔"
                                label="Staff Matrix"
                                href="/admin/staff/manage"
                                gradient="from-purple-500 to-pink-700"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
