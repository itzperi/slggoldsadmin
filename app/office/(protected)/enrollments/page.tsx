'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { BookOpen, UserCircle, Calendar, IndianRupee, CreditCard, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function SchemeEnrollmentPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [schemes, setSchemes] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedScheme, setSelectedScheme] = useState('');
    const [formData, setFormData] = useState({
        frequency: 'daily',
        minAmount: 100,
        maxAmount: 10000,
        startDate: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data: customersData } = await supabase.from('customers').select('id, full_name, phone');
            const { data: schemesData } = await supabase.from('schemes').select('id, name, min_amount, max_amount');
            if (customersData) setCustomers(customersData);
            if (schemesData) setSchemes(schemesData);
        };
        fetchData();
    }, []);

    const handleSchemeChange = (schemeId: string) => {
        setSelectedScheme(schemeId);
        const scheme = schemes.find(s => s.id === schemeId);
        if (scheme) {
            setFormData({
                ...formData,
                minAmount: scheme.min_amount,
                maxAmount: scheme.max_amount
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.from('user_schemes').insert({
                customer_id: selectedCustomer,
                scheme_id: selectedScheme,
                payment_frequency: formData.frequency,
                min_amount: formData.minAmount,
                max_amount: formData.maxAmount,
                start_date: formData.startDate,
                status: 'active'
            });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Customer enrolled in scheme successfully!' });
            setSelectedCustomer('');
            setSelectedScheme('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in max-w-2xl mx-auto py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <h1 className="text-3xl md:text-4xl font-bold gold-gradient uppercase tracking-tight font-black">Customer Enrollment</h1>
                <div className="glass px-6 py-3 rounded-xl border border-yellow-500/20 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="text-sm font-medium text-white/80 uppercase tracking-widest">Scheme Ledger Open</span>
                </div>
            </div>

            <div className="glass p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 opacity-5">
                    <BookOpen size={200} />
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                            <UserCircle className="text-yellow-500" size={20} />
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">1. Select Target Beneficiary</h2>
                        </div>
                        <div className="group relative">
                            <select
                                value={selectedCustomer}
                                onChange={(e) => setSelectedCustomer(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-yellow-500/50 outline-none transition-all appearance-none cursor-pointer font-bold"
                            >
                                <option value="" className="bg-[#0A1F44]">PROCEED TO CHOOSE CUSTOMER</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id} className="bg-[#0A1F44]">{c.full_name.toUpperCase()} — {c.phone}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                            <CreditCard className="text-yellow-500" size={20} />
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">2. Select Investment Program</h2>
                        </div>
                        <div className="group relative">
                            <select
                                value={selectedScheme}
                                onChange={(e) => handleSchemeChange(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-yellow-500/50 outline-none transition-all appearance-none cursor-pointer font-bold"
                            >
                                <option value="" className="bg-[#0A1F44]">SELECT SAVINGS SCHEME</option>
                                {schemes.map(s => (
                                    <option key={s.id} value={s.id} className="bg-[#0A1F44]">{s.name.toUpperCase()}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Frequency</label>
                            <div className="relative">
                                <select
                                    value={formData.frequency}
                                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-yellow-500/50 outline-none transition-all font-bold appearance-none"
                                >
                                    <option value="daily" className="bg-[#0A1F44]">DAILY</option>
                                    <option value="weekly" className="bg-[#0A1F44]">WEEKLY</option>
                                    <option value="monthly" className="bg-[#0A1F44]">MONTHLY</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Activation Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/50" size={16} />
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white focus:border-yellow-500/50 outline-none transition-all font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Min Entry (₹)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/50" size={16} />
                                <input
                                    type="number"
                                    value={formData.minAmount}
                                    onChange={(e) => setFormData({ ...formData, minAmount: Number(e.target.value) })}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white focus:border-yellow-500/50 outline-none transition-all font-bold"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Max Ceiling (₹)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/50" size={16} />
                                <input
                                    type="number"
                                    value={formData.maxAmount}
                                    onChange={(e) => setFormData({ ...formData, maxAmount: Number(e.target.value) })}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white focus:border-yellow-500/50 outline-none transition-all font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-2xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <span className="text-xs font-black uppercase tracking-widest">{message.text}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-500 text-black font-black py-5 rounded-2xl hover:bg-yellow-400 hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-yellow-500/20 uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                    >
                        {loading ? 'SYNCING...' : 'CONFIRM OPERATIONAL ENROLLMENT'}
                    </button>
                </form>
            </div>
        </div>
    );
}
