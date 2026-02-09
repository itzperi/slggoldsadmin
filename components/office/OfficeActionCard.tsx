'use client';

import Link from 'next/link';

interface OfficeActionCardProps {
    title: string;
    desc: string;
    icon: string;
    href: string;
}

export default function OfficeActionCard({ title, desc, icon, href }: OfficeActionCardProps) {
    return (
        <Link href={href}>
            <div className="bg-white p-10 rounded-[40px] border border-orange-100 shadow-xl shadow-orange-500/5 
                          hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all duration-500 group cursor-pointer h-full">
                <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center text-5xl mb-8 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-4 group-hover:text-orange-600 transition-colors">
                    {title}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                    {desc}
                </p>
                <div className="mt-8 flex items-center text-orange-600 font-bold text-sm uppercase tracking-widest gap-2">
                    Open Action <span className="group-hover:translate-x-2 transition-transform">→</span>
                </div>
            </div>
        </Link>
    );
}
