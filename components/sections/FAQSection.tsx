'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: 'What documents do I need to start investing?',
        answer:
            'You need a valid ID proof (Aadhar, PAN, Passport) and address proof. Visit our office with these documents to get started.',
    },
    {
        question: 'Can I invest with small amounts?',
        answer:
            'Yes! Our schemes start from as low as ₹50 per day. Choose a plan that fits your budget.',
    },
    {
        question: 'How do I track my investment?',
        answer:
            'Download our mobile app (available on Android/iOS) and log in with your credentials. You can see your portfolio, payments, and accumulated gold/silver in real-time.',
    },
    {
        question: 'When can I withdraw my investment?',
        answer:
            'You can request a withdrawal anytime after completing your scheme. Withdrawals are processed within 3-5 business days.',
    },
    {
        question: 'Is my investment secure?',
        answer:
            'Absolutely. We follow government regulations, maintain transparent records, and provide you with complete visibility of your investment via our app.',
    },
    {
        question: 'What payment methods do you accept?',
        answer:
            'We accept cash, UPI, bank transfers, and online payments. Choose what\'s most convenient for you.',
    },
];

export default function FAQSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 bg-gray-50" ref={ref}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2
                    className="text-4xl md:text-5xl font-bold text-center text-[#0A1F44] mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    Frequently Asked{' '}
                    <span className="bg-gradient-to-r from-[#FFD700] to-[#B8860B] bg-clip-text text-transparent">
                        Questions
                    </span>
                </motion.h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-xl shadow-md overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-lg font-semibold text-[#0A1F44] pr-4">
                                    {faq.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-shrink-0"
                                >
                                    {openIndex === index ? (
                                        <Minus className="text-[#FFD700]" size={24} />
                                    ) : (
                                        <Plus className="text-[#FFD700]" size={24} />
                                    )}
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
