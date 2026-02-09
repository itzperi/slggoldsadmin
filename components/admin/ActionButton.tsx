'use client';

import Link from 'next/link';

interface ActionButtonProps {
    icon: string;
    label: string;
    href: string;
    gradient: string;
}

export default function ActionButton({ icon, label, href, gradient }: ActionButtonProps) {
    return (
        <Link href={href}>
            <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} p-8 rounded-3xl 
                            hover:scale-[1.03] hover:shadow-2xl hover:shadow-${gradient.split('-')[1]}-500/20 
                            transition-all duration-500 group cursor-pointer h-full border border-white/10 shadow-lg`}>

                {/* Background Shimmer Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                <div className="relative z-10">
                    <div className="text-5xl mb-6 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">{icon}</div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:translate-x-2 transition-transform">
                        {label}
                    </h3>
                    <div className="w-12 h-1 bg-white/20 mt-4 rounded-full group-hover:w-24 group-hover:bg-white/40 transition-all duration-500"></div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
            </div>
        </Link>
    );
}
