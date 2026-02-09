'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Shield, TrendingUp, Smartphone } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HeroSection() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <section
            id="home"
            suppressHydrationWarning
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #0A1F44 0%, #1a0f3e 50%, #0a051a 100%)',
            }}
        >
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {isMounted && [...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-[#FFD700] rounded-full opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" suppressHydrationWarning>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Text Content */}
                    <div>
                        <motion.h1
                            className="text-5xl md:text-7xl font-bold text-white mb-6 text-center md:text-left"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Build Your Wealth with{' '}
                            <span className="bg-gradient-to-r from-[#FFD700] to-[#B8860B] bg-clip-text text-transparent">
                                Gold & Silver
                            </span>
                        </motion.h1>

                        <motion.p
                            className="text-xl md:text-2xl text-[#FFD700]/80 mb-8 text-center md:text-left"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Secure. Trusted. Flexible Investment Schemes for Your Future.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 mb-12 justify-center md:justify-start"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <a
                                href="#contact"
                                className="px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-[#0A1F44] font-bold rounded-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 text-center"
                            >
                                Get Started Today
                            </a>
                            <a
                                href="#how-it-works"
                                className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#0A1F44] transition-all duration-200 text-center"
                            >
                                Learn How It Works
                            </a>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            className="grid grid-cols-3 gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#FFD700]">10,000+</div>
                                <div className="text-sm text-white/70">Happy Investors</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#FFD700]">₹500Cr+</div>
                                <div className="text-sm text-white/70">Assets Managed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#FFD700]">15+ Years</div>
                                <div className="text-sm text-white/70">of Trust</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: 3D Visual */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        <div className="relative w-full h-96 flex items-center justify-center">
                            {/* Animated Gold Coins */}
                            <motion.div
                                className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] shadow-2xl"
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [0, 360],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            />
                            <motion.div
                                className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-[#C0C0C0] to-[#A8A8A8] shadow-2xl"
                                style={{ top: '20%', right: '20%' }}
                                animate={{
                                    y: [0, -15, 0],
                                    rotate: [0, -360],
                                }}
                                transition={{
                                    duration: 3.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: 0.5,
                                }}
                            />
                            <motion.div
                                className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] shadow-2xl"
                                style={{ bottom: '20%', left: '20%' }}
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, 360],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: 1,
                                }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                <ArrowDown className="text-[#FFD700]" size={32} />
            </motion.div>
        </section>
    );
}
