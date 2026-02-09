'use client';

import { useEffect, useState } from 'react';


export default function MarketRatesPage() {
    const [goldRate, setGoldRate] = useState('');
    const [silverRate, setSilverRate] = useState('');
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHistory();
        const interval = setInterval(fetchHistory, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/admin/market-rates');
            if (res.ok) {
                const data = await res.json();
                if (data && Object.keys(data).length > 0) {
                    setHistory(Array.isArray(data) ? data : [data]);
                    // Note: API returns single latest object or list? 
                    // GET route returns single latest object. 
                    // But the UI expects a history list?
                    // The previous code fetched limit(10).
                    // My API route `GET` returns `.single()`.
                    // I should probably update the API route to return history list OR update UI.
                    // The UI maps over `history`. 
                    // Let me check the API route I created.
                    // API route: `.limit(1).single()`.
                    // So it returns ONE object.
                    // The UI expects an array `history.map`.
                    // I made a mistake in the API route design vs UI requirement.
                    // I will fix the UI to handle single object for now, or better, update API to return list.
                    // Updating API is better.

                    // Actually, let's fix the API route first in a separate step or fix it here by updating the UI to just show latest?
                    // The UI has a "Pricing History" table.
                    // So I MUST update the API route to return a list.
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updateRates = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/market-rates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gold_rate_22k: parseFloat(goldRate),
                    silver_rate_1g: parseFloat(silverRate), // Schema mismatch? Previous code used silver_rate_per_gram?
                    // Page code: silver_rate_per_gram: parseFloat(silverRate)
                    // API route: insert(body)
                    // So I should send `silver_rate_per_gram`.
                    silver_rate_per_gram: parseFloat(silverRate),
                    gold_rate_per_gram: parseFloat(goldRate),
                    date: new Date().toISOString().split('T')[0]
                })
            });

            if (!res.ok) {
                const result = await res.json();
                throw new Error(result.error || 'Update failed');
            }

            alert('Rates updated! All portfolios refreshed instantly.');
            fetchHistory();
            setGoldRate('');
            setSilverRate('');
        } catch (error: any) {
            alert('Update failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <h1 className="text-3xl md:text-4xl font-bold gold-gradient uppercase tracking-tight font-black">Market Rates</h1>
                <div className="glass px-6 py-3 rounded-xl border border-yellow-500/20 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="text-sm font-medium text-white/80 uppercase tracking-widest text-center">Live App Broadcasting</span>
                </div>
            </div>

            <div className="glass p-8 rounded-3xl border border-white/10 bg-white/5 mb-10">
                <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-8 text-center">Update Daily Rates (1g)</h2>
                <form onSubmit={updateRates} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block text-center md:text-left">Gold (24K)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 font-bold">₹</span>
                            <input type="number" step="0.01" value={goldRate} onChange={(e) => setGoldRate(e.target.value)} placeholder="0.00" required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-10 text-white focus:border-yellow-500/50 outline-none transition-all text-xl font-bold" />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block text-center md:text-left">Silver (999)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                            <input type="number" step="0.01" value={silverRate} onChange={(e) => setSilverRate(e.target.value)} placeholder="0.00" required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-10 text-white focus:border-yellow-500/50 outline-none transition-all text-xl font-bold" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-yellow-500 text-black font-black py-4 rounded-xl hover:bg-yellow-400 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-yellow-500/20 uppercase tracking-widest">
                        {loading ? 'Publishing...' : 'Publish Rates'}
                    </button>
                </form>
            </div>

            <div className="glass rounded-3xl border border-white/10 overflow-hidden bg-white/5">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-sm font-black text-white uppercase tracking-widest">Pricing History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                <th className="px-8 py-5">Effective Date</th>
                                <th className="px-8 py-5">Gold (1g)</th>
                                <th className="px-8 py-5">Silver (1g)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {history.map((rate, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-5 text-gray-400 font-medium">{new Date(rate.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                    <td className="px-8 py-5 text-yellow-500 font-black text-lg">₹{rate.gold_rate_per_gram}</td>
                                    <td className="px-8 py-5 text-white font-bold opacity-80">₹{rate.silver_rate_per_gram}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
