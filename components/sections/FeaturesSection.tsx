'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Activity, CreditCard, TrendingUp, Wallet, Users, FileText } from 'lucide-react';

const features = [
    {
        icon: Activity,
        title: 'Real-Time Tracking',
        description:
            'Monitor your portfolio, payments, and gold/silver accumulation in real-time via mobile app.',
    },
    {
        icon: CreditCard,
        title: 'Multiple Payment Methods',
        description: 'Pay with cash, UPI, bank transfer - whatever suits you best.',
    },
    {
        icon: TrendingUp,
        title: 'Daily Market Rates',
        description:
            'Transparent pricing with daily updated gold and silver market rates.',
    },
    {
        icon: Wallet,
        title: 'Secure Withdrawals',
        description:
            'Request withdrawals anytime. Get your accumulated gold/silver converted to cash instantly.',
    },
    {
        icon: Users,
        title: 'Professional Support',
        description:
            'Dedicated office staff and collection agents to assist you at every step.',
    },
    {
        icon: FileText,
        title: 'Detailed Reports',
        description:
            'Access your complete payment history, scheme details, and withdrawal records anytime.',
    },
];

export default function FeaturesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section
            id="features"
            className="py-20"
            style={{
                background: 'linear-gradient(135deg, #0A1F44 0%, #000000 100%)',
            }}
            ref={ref}
            suppressHydrationWarning
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2
                    className="text-4xl md:text-5xl font-bold text-center text-white mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    Powerful Features for Your{' '}
                    <span className="bg-gradient-to-r from-[#FFD700] to-[#B8860B] bg-clip-text text-transparent">
                        Investment Journey
                    </span>
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="group p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 text-center"
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <motion.div
                                className="mb-4 flex justify-center"
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <feature.icon className="text-[#FFD700]" size={48} />
                            </motion.div>

                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#FFD700] transition-colors duration-300">
                                {feature.title}
                            </h3>

                            <p className="text-gray-300 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
