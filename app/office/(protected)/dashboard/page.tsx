'use client';

import Link from 'next/link';
import MetricCard from '@/components/admin/MetricCard';
import { Users, CreditCard, UserPlus, ClipboardList, Wallet, FileText, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
export default function OfficeDashboard() {
    const [stats, setStats] = useState<any>({});

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/office/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to load stats', error);
            }
        };
        fetchStats();
    }, []);

    const officeActions = [
        { title: 'Enroll New Customer', href: '/office/customers/add', desc: 'Register new customer & KYC', icon: UserPlus },
        { title: 'Scheme Enrollment', href: '/office/customers/enroll', desc: 'Add scheme to customer portfolio', icon: FileText },
        { title: 'Records Payments', href: '/office/payments', desc: 'Manual payment entry', icon: CreditCard },
        { title: 'Staff Assignments', href: '/office/assignments', desc: 'Link collection agents to customers', icon: ClipboardList },
    ];
    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <h1 className="text-3xl md:text-4xl font-bold gold-gradient uppercase tracking-tight">Office Operations</h1>
                <div className="glass px-6 py-3 rounded-xl border border-[#FFD700]/20 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-white/80">DESK SYNC ACTIVE</span>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <MetricCard
                    title="Active Customers"
                    value={stats.total_customers || 0}
                    icon={Users}
                    trend="+0%"
                    color="from-yellow-400/20 to-yellow-600/20"
                />
                <MetricCard
                    title="Today's Enrollments"
                    value={stats.today_enrollments || 0}
                    icon={FileText}
                    trend="+0%"
                    color="from-blue-400/20 to-blue-600/20"
                />
                <MetricCard
                    title="Pending Payouts"
                    value={stats.pending_withdrawals || 0}
                    icon={Wallet}
                    trend="+0%"
                    color="from-red-400/20 to-red-600/20"
                />
            </div>

            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Quick Operations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {officeActions.map((action, index) => (
                    <Link key={index} href={action.href} className="group">
                        <div className="glass p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-blue-500/5 hover:border-blue-500/20 transition-all duration-300 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                                <action.icon className="text-blue-400 group-hover:text-blue-300" size={32} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{action.title}</h3>
                                <p className="text-gray-400 text-sm">{action.desc}</p>
                            </div>
                            <ArrowRight className="text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" size={24} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
