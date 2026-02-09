'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const data = [
    { name: 'Mon', collections: 4000, withdrawals: 2400 },
    { name: 'Tue', collections: 3000, withdrawals: 1398 },
    { name: 'Wed', collections: 2000, withdrawals: 9800 },
    { name: 'Thu', collections: 2780, withdrawals: 3908 },
    { name: 'Fri', collections: 1890, withdrawals: 4800 },
    { name: 'Sat', collections: 2390, withdrawals: 3800 },
    { name: 'Sun', collections: 3490, withdrawals: 4300 },
];

export default function FinancialChart() {
    return (
        <div className="glass p-8 rounded-3xl border border-white/10 bg-white/5 h-[400px]">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Financial Overview</h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Weekly Collections vs Withdrawals</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Collections</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-400" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Withdrawals</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorColl" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorWith" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 'bold' }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 'bold' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0A1F44',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#fff'
                        }}
                        itemStyle={{ color: '#FFD700' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="collections"
                        stroke="#FFD700"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorColl)"
                    />
                    <Area
                        type="monotone"
                        dataKey="withdrawals"
                        stroke="#60A5FA"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorWith)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
