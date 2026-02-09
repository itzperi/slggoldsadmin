'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { UserCheck, Phone, Search, ArrowRight } from 'lucide-react';

export default function OfficeAssignmentsPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [customersRes, staffRes] = await Promise.all([
                supabase.from('customers').select('*').order('full_name'),
                supabase.from('profiles').select('id, full_name').eq('role', 'collection_staff').order('full_name')
            ]);

            if (customersRes.data) setCustomers(customersRes.data);
            if (staffRes.data) setStaff(staffRes.data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const assignStaff = async (customerId: string, staffId: string) => {
        const { error } = await supabase
            .from('staff_assignments')
            .upsert({
                customer_id: customerId,
                staff_id: staffId,
                assigned_date: new Date().toISOString().split('T')[0],
                is_active: true
            }, { onConflict: 'customer_id' });

        if (!error) {
            alert('Staff assigned! Customer will see the staff in their app instantly.');
            // Refresh to show assignment
            const { data } = await supabase.from('customers').select('*').order('full_name');
            if (data) setCustomers(data);
        } else {
            alert('Assignment failed: ' + error.message);
        }
    };

    return (
        <div className="animate-fade-in max-w-4xl mx-auto py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <h1 className="text-3xl md:text-4xl font-bold gold-gradient uppercase tracking-tight font-black">Field Assignments</h1>
                <div className="glass px-6 py-3 rounded-xl border border-yellow-500/20 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="text-sm font-medium text-white/80 uppercase tracking-widest">System Sync Active</span>
                </div>
            </div>

            <div className="glass rounded-3xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-md">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <UserCheck className="text-yellow-500" size={24} />
                        <div>
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Active Customer Portfolios</h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Link collection agents to customers</p>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                <th className="px-8 py-5">Customer & Phone</th>
                                <th className="px-8 py-5 text-center">Current Status</th>
                                <th className="px-8 py-5 text-right">Assign Agent</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {customers.map((c) => (
                                <CustomerRow key={c.id} customer={c} staffList={staff} onAssign={assignStaff} />
                            ))}
                            {customers.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-8 py-10 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                                        No customers found to assign.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function CustomerRow({ customer, staffList, onAssign }: any) {
    const [selectedStaff, setSelectedStaff] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    const handleAction = async () => {
        setIsAssigning(true);
        await onAssign(customer.id, selectedStaff);
        setIsAssigning(false);
    };

    return (
        <tr className="hover:bg-white/5 transition-colors group">
            <td className="px-8 py-5">
                <div className="font-bold text-white group-hover:text-yellow-500 transition-colors uppercase tracking-tight">{customer.full_name}</div>
                <div className="text-[10px] text-gray-500 font-bold flex items-center gap-1 mt-1">
                    <Phone size={10} /> {customer.phone}
                </div>
            </td>
            <td className="px-8 py-5 text-center">
                <span className="text-[10px] bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-gray-400 font-black uppercase tracking-widest">
                    SYNCING...
                </span>
            </td>
            <td className="px-8 py-5 text-right">
                <div className="flex justify-end items-center gap-4">
                    <select
                        value={selectedStaff}
                        onChange={(e) => setSelectedStaff(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500/50 outline-none transition-all font-bold min-w-[150px]"
                    >
                        <option value="">Agent</option>
                        {staffList.map((s: any) => (
                            <option key={s.id} value={s.id}>{s.full_name}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleAction}
                        disabled={!selectedStaff || isAssigning}
                        className="bg-yellow-500 text-black px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-yellow-500/10 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {isAssigning ? '...' : 'LINK'}
                    </button>
                </div>
            </td>
        </tr>
    );
}
