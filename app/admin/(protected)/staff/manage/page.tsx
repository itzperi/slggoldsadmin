'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, UserPlus, Shield } from 'lucide-react';

export default function ManageStaff() {
    const router = useRouter();
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStaff();
        // Refresh when page becomes visible (e.g., after navigation from create page)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                loadStaff();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    async function loadStaff() {
        setLoading(true);
        console.log('[ManageStaff] Fetching staff list...');
        try {
            const response = await fetch('/api/admin/staff/list');
            console.log('[ManageStaff] Response status:', response.status);

            const result = await response.json();
            console.log('[ManageStaff] Raw API Response:', result);

            if (!response.ok) {
                console.error('[ManageStaff] API Error:', result.error);
                alert(`Error loading staff: ${result.error}`);
            } else {
                // STRICT CHECKING - No silent fallbacks
                if (result.data) {
                    console.log('[ManageStaff] Using result.data', result.data);
                    setStaff(result.data);
                } else if (result.staff) {
                    console.log('[ManageStaff] Using result.staff', result.staff);
                    setStaff(result.staff);
                } else {
                    console.error('[ManageStaff] Unexpected response shape:', result);
                    alert('Error: API response missing "data" or "staff" field');
                    setStaff([]);
                }
            }
        } catch (error) {
            console.error('[ManageStaff] Network error:', error);
            alert('Network error loading staff');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="animate-fade-in max-w-5xl mx-auto py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <h1 className="text-3xl md:text-4xl font-bold gold-gradient uppercase tracking-tight font-black">Staff Control</h1>
                <Link href="/admin/staff/create" className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-yellow-500/20 flex items-center gap-3">
                    <UserPlus size={18} /> Create Staff
                </Link>
            </div>

            <div className="glass rounded-3xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-md">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <Users className="text-yellow-500" size={24} />
                        <div>
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Employee Directory</h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Manage permissions and view active personnel</p>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                <th className="px-8 py-5">Staff Code</th>
                                <th className="px-8 py-5">Name</th>
                                <th className="px-8 py-5">Username</th>
                                <th className="px-8 py-5 text-center">Status</th>
                                <th className="px-8 py-5 text-center">Assigned Customers</th>
                                <th className="px-8 py-5 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                                        Loading staff...
                                    </td>
                                </tr>
                            )}
                            {!loading && staff.map((s: any) => (
                                <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="font-mono font-bold text-yellow-500 group-hover:text-yellow-400 transition-colors uppercase tracking-tight">
                                            {s.staff_code || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="font-bold text-white group-hover:text-yellow-500 transition-colors uppercase tracking-tight">
                                            {s.name || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-sm text-gray-300 font-mono">
                                            {s.username || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${s.status === 'active'
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {s.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="text-sm font-bold text-white">
                                            {s.assigned_customers_count || 0}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <Link href={`/admin/staff/${s.id}`}>
                                            <button className="text-gray-500 hover:text-yellow-500 transition-colors flex items-center gap-2 ml-auto">
                                                <Shield size={18} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">View</span>
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {!loading && staff.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                                        No staff accounts identified in system.
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
