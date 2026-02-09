'use client';

import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    trend: string;
    color: string;
    icon?: LucideIcon;
}

export default function MetricCard({ title, value, trend, color, icon: Icon }: MetricCardProps) {
    const isPositive = trend.startsWith('+');

    return (
        <div className="relative group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-white shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100"></div>

            {/* Left Accent Border */}
            <div className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${color} rounded-l-3xl group-hover:w-3 transition-all`}></div>

            <div className="relative p-8 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
                        <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
                    </div>
                    {Icon && (
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                            <Icon size={20} />
                        </div>
                    )}
                </div>

                <div className="mt-6 flex items-center gap-2">
                    <span className={`text-xs font-black px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                        {trend}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        from last month
                    </span>
                </div>
            </div>

            {/* Subtle Inner Glow */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-white/0 to-slate-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
        </div>
    );
}
