'use client';
import { useState, useEffect } from 'react';


export default function SchemesManager() {
    const [schemes, setSchemes] = useState<any[]>([]);
    const [formData, setFormData] = useState({ name: '', emi: '', tenure: '', grams: '' });

    // REPLACED: Direct Supabase client usage with API calls

    // LIVE SYNC TO CUSTOMER APP
    // Polling fallback since we removed direct subscription for strict isolation
    useEffect(() => {
        loadSchemes();
        // Optional: Poll every 30s to keep fresh without websocket
        const interval = setInterval(loadSchemes, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadSchemes = async () => {
        try {
            const res = await fetch('/api/admin/schemes');
            if (res.ok) {
                const data = await res.json();
                setSchemes(data);
            }
        } catch (error) {
            console.error('Failed to load schemes', error);
        }
    };

    const createScheme = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/schemes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    installment_amount: parseFloat(formData.emi),
                    duration_months: parseInt(formData.tenure),
                    expected_grams: parseFloat(formData.grams),
                    active: true,
                    description: `${formData.emi} × ${formData.tenure}m = ${formData.grams}g`,
                    asset_type: 'gold'
                })
            });

            const result = await res.json();

            if (!res.ok) {
                alert('Error creating scheme: ' + (result.error || 'Unknown error'));
            } else {
                setFormData({ name: '', emi: '', tenure: '', grams: '' });
                loadSchemes();
            }
        } catch (error: any) {
            alert('Error creating scheme: ' + error.message);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <h1 className="text-3xl md:text-4xl font-bold gold-gradient uppercase tracking-tight font-black">Investment Schemes</h1>
                <div className="glass px-6 py-3 rounded-xl border border-yellow-500/20 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="text-sm font-medium text-white/80 uppercase tracking-widest">Customer App Sync active</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Creation Form */}
                <div className="lg:col-span-1">
                    <div className="glass p-8 rounded-3xl border border-white/10 bg-white/5 sticky top-8">
                        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Create New Scheme</h2>
                        <form onSubmit={createScheme} className="space-y-5">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Scheme Name</label>
                                <input
                                    placeholder="e.g. Gold Savings Plus"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:border-yellow-500/50 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">EMI (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.emi}
                                        onChange={e => setFormData({ ...formData, emi: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:border-yellow-500/50 outline-none transition-all text-center font-bold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Tenure (m)</label>
                                    <input
                                        type="number"
                                        value={formData.tenure}
                                        onChange={e => setFormData({ ...formData, tenure: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:border-yellow-500/50 outline-none transition-all text-center font-bold"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Target Weight (g)</label>
                                <input
                                    type="number" step="0.01"
                                    value={formData.grams}
                                    onChange={e => setFormData({ ...formData, grams: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:border-yellow-500/50 outline-none transition-all text-center font-bold"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-yellow-500 text-black font-black py-4 rounded-xl hover:bg-yellow-400 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-yellow-500/20 uppercase tracking-widest">
                                Activate Scheme
                            </button>
                        </form>
                    </div>
                </div>

                {/* Schemes List */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {schemes.map(s => (
                            <div key={s.id} className="glass p-6 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="font-black text-xl text-white group-hover:text-yellow-500 transition-colors tracking-tight uppercase">{s.name}</h3>
                                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">Metal Type: {s.asset_type}</p>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${s.active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {s.active ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-white/5 p-3 rounded-2xl text-center">
                                        <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">EMI</p>
                                        <p className="text-sm font-bold text-white">₹{s.installment_amount}</p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-2xl text-center">
                                        <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">Tenure</p>
                                        <p className="text-sm font-bold text-white">{s.duration_months}m</p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-2xl text-center">
                                        <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">Grams</p>
                                        <p className="text-sm font-bold text-yellow-500">{s.expected_grams}g</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
                                    <span>Created: {new Date(s.created_at).toLocaleDateString()}</span>
                                    <button className="text-white hover:text-yellow-500 font-bold uppercase tracking-widest">Edit</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
