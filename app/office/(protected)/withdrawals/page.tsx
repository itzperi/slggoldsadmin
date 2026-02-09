'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ClipboardCheck, Phone, Check, RefreshCw, AlertCircle, Clock } from 'lucide-react';

export default function WithdrawalApprovalPage() {
    const [withdrawals, setWithdrawals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('withdrawals')
            .select(`
        *,
        customers(full_name, phone),
        user_schemes(scheme_id, total_grams, schemes(name))
      `)
            .order('created_at', { ascending: false });

        if (data) setWithdrawals(data);
        setLoading(false);
    };

    const handleApprove = async (id: string) => {
        setProcessing(id);
        const { error } = await supabase
            .from('withdrawals')
            .update({
                status: 'approved',
                approved_by: (await supabase.auth.getUser()).data.user?.id,
                approved_date: new Date().toISOString()
            })
            .eq('id', id);

        if (!error) fetchWithdrawals();
        setProcessing(null);
    };

    const handleProcess = async (id: string, grams: number) => {
        setProcessing(id);
        // 1. Get current market rate (mocking this)
        const goldRate = 6500;
        const finalAmount = grams * goldRate;

        const { error } = await supabase
            .from('withdrawals')
            .update({
                status: 'processed',
                final_amount: finalAmount,
                final_grams: grams,
                processed_date: new Date().toISOString()
            })
            .eq('id', id);

        if (!error) fetchWithdrawals();
        setProcessing(null);
    };

    return (
        <div className="animate-fade-in max-w-5xl mx-auto py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <h1 className="text-3xl md:text-4xl font-bold gold-gradient uppercase tracking-tight font-black">Withdrawal Requests</h1>
                <div className="glass px-6 py-3 rounded-xl border border-yellow-500/20 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="text-sm font-medium text-white/80 uppercase tracking-widest">Realtime Feed Live</span>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <RefreshCw className="text-yellow-500 animate-spin" size={40} />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">Fetching Secure Requests...</p>
                </div>
            ) : (
                <div className="glass rounded-3xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-md">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <ClipboardCheck className="text-yellow-500" size={24} />
                            <div>
                                <h2 className="text-sm font-black text-white uppercase tracking-widest">Payout Queue</h2>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Approve and process gold liquidations</p>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                    <th className="px-8 py-5">Request Date</th>
                                    <th className="px-8 py-5">Customer & Scheme</th>
                                    <th className="px-8 py-5 text-center">Grams</th>
                                    <th className="px-8 py-5 text-center">Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {withdrawals.map((w) => (
                                    <tr key={w.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="text-sm text-white font-medium">{new Date(w.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                            <div className="text-[10px] text-gray-500 font-bold flex items-center gap-1 mt-1">
                                                <Clock size={10} /> {new Date(w.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-white group-hover:text-yellow-500 transition-colors uppercase tracking-tight">{w.customers.full_name}</div>
                                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Scheme: {w.user_schemes?.schemes?.name || 'Manual'}</div>
                                        </td>
                                        <td className="px-8 py-5 text-center font-black text-white">
                                            {w.requested_grams}<span className="text-[10px] text-yellow-500 ml-0.5">g</span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${w.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                w.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    w.status === 'processed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                        'bg-red-500/10 text-red-500 border-red-500/20'
                                                }`}>
                                                {w.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-3">
                                                {w.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleApprove(w.id)}
                                                        disabled={processing === w.id}
                                                        className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-yellow-500/10"
                                                    >
                                                        {processing === w.id ? '...' : 'Approve'}
                                                    </button>
                                                )}
                                                {w.status === 'approved' && (
                                                    <button
                                                        onClick={() => handleProcess(w.id, w.requested_grams)}
                                                        disabled={processing === w.id}
                                                        className="bg-green-500 text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-400 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-green-500/10"
                                                    >
                                                        {processing === w.id ? '...' : 'Process'}
                                                    </button>
                                                )}
                                                {w.status === 'processed' && (
                                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest py-2">
                                                        COMPLETED
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {withdrawals.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <AlertCircle className="text-gray-600 mx-auto mb-4" size={40} />
                                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No active withdrawal requests.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
