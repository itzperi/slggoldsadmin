'use client';

import { motion } from 'framer-motion';
import { Shield, TrendingUp, Smartphone } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const benefits = [
    {
        icon: Shield,
        title: 'Secure Investment',
        description:
            'Your wealth is protected with government-approved schemes and transparent tracking.',
    },
    {
        icon: TrendingUp,
        title: 'Flexible Plans',
        description:
            '18 investment schemes (Gold & Silver) with daily, weekly, or monthly contributions.',
    },
    {
        icon: Smartphone,
        title: 'Easy Management',
        description:
            'Track your portfolio, payments, and withdrawals from anywhere with our mobile app.',
    },
];

export default function BenefitsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="benefits" className="py-20 bg-white" ref={ref} suppressHydrationWarning>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2
                    className="text-4xl md:text-5xl font-bold text-center text-[#0A1F44] mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    Why Choose{' '}
                    <span className="bg-gradient-to-r from-[#FFD700] to-[#B8860B] bg-clip-text text-transparent">
                        SLG Thangangal?
                    </span>
                </motion.h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 text-center"
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <motion.div
                                className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#B8860B] rounded-full flex items-center justify-center mb-6 mx-auto"
                                whileHover={{ scale: 1.1, rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                <benefit.icon className="text-white" size={32} />
                            </motion.div>

                            <h3 className="text-2xl font-bold text-[#0A1F44] mb-4">
                                {benefit.title}
                            </h3>

                            <p className="text-gray-600 leading-relaxed">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
