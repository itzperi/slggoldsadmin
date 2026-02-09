'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function CTASection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section
            className="py-24 relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
            }}
            ref={ref}
        >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 opacity-30">
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                        animation: 'shimmer 3s infinite',
                    }}
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.h2
                    className="text-4xl md:text-6xl font-bold text-[#0A1F44] mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    Ready to Start Building Your Wealth?
                </motion.h2>

                <motion.p
                    className="text-xl md:text-2xl text-[#0A1F44]/80 mb-10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Join thousands of investors who trust SLG Thangangal for their gold and
                    silver investments.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <a
                        href="#contact"
                        className="inline-block px-12 py-5 bg-[#0A1F44] text-white font-bold text-lg rounded-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
                    >
                        Contact Us Today
                    </a>

                    <p className="mt-6 text-[#0A1F44]/70">
                        or call us at{' '}
                        <a
                            href="tel:+91XXXXXXXXXX"
                            className="font-bold text-[#0A1F44] hover:underline"
                        >
                            +91-XXXXXXXXXX
                        </a>
                    </p>
                </motion.div>
            </div>

            <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
        </section>
    );
}
