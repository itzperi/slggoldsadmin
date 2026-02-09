'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Building2, FileCheck, Coins, TrendingUp } from 'lucide-react';

const steps = [
    {
        number: 1,
        icon: Building2,
        title: 'Visit Our Office',
        description: 'Come to our office with your documents (ID proof, address proof)',
    },
    {
        number: 2,
        icon: FileCheck,
        title: 'Choose Your Scheme',
        description: 'Select from 18 Gold/Silver schemes based on your budget and frequency',
    },
    {
        number: 3,
        icon: Coins,
        title: 'Start Contributing',
        description: 'Make daily, weekly, or monthly payments as per your chosen scheme',
    },
    {
        number: 4,
        icon: TrendingUp,
        title: 'Grow Your Wealth',
        description: 'Track accumulation, request withdrawals, and watch your investment grow',
    },
];

export default function HowItWorksSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="how-it-works" className="py-20 bg-gray-50" ref={ref} suppressHydrationWarning>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2
                    className="text-4xl md:text-5xl font-bold text-center text-[#0A1F44] mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    Simple Steps to{' '}
                    <span className="bg-gradient-to-r from-[#FFD700] to-[#B8860B] bg-clip-text text-transparent">
                        Start Investing
                    </span>
                </motion.h2>

                {/* Desktop Timeline */}
                <div className="hidden md:block relative">
                    {/* Connecting Line */}
                    <motion.div
                        className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] to-[#B8860B]"
                        initial={{ scaleX: 0 }}
                        animate={isInView ? { scaleX: 1 } : {}}
                        transition={{ duration: 1.5, delay: 0.3 }}
                        style={{ transformOrigin: 'left' }}
                    />

                    <div className="grid grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="relative"
                                initial={{ opacity: 0, y: 50 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                            >
                                {/* Number Badge */}
                                <div className="flex justify-center mb-6">
                                    <motion.div
                                        className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center border-4 border-white shadow-xl relative z-10"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <step.icon className="text-[#0A1F44]" size={48} />
                                    </motion.div>
                                </div>

                                <footer className="bg-[#0A1F44] text-white py-16" suppressHydrationWarning>
                                    <h3 className="text-xl font-bold text-[#0A1F44] mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </footer>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Mobile Timeline */}
                <div className="md:hidden space-y-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="flex flex-col items-center text-center gap-4"
                            initial={{ opacity: 0, x: -50 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center shadow-lg">
                                    <step.icon className="text-[#0A1F44]" size={28} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#0A1F44] mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600">{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 1 }}
                >
                    <a
                        href="#contact"
                        className="inline-block px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-[#0A1F44] font-bold rounded-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
                    >
                        Find Our Office Location
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
