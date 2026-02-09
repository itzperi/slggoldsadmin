'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Rajesh Kumar',
        role: 'Business Owner',
        content: 'SLG Thangangal has made gold investment so easy and transparent. I love the daily collection feature which helps me save without any burden.',
        rating: 5,
        location: 'Nagercoil'
    },
    {
        name: 'Priya Lakshmi',
        role: 'Homemaker',
        content: 'I have been part of their silver scheme for 2 years now. The mobile app makes it so easy to track my accumulation. Highly recommended!',
        rating: 5,
        location: 'Trivandrum'
    },
    {
        name: 'Dr. Arun Varma',
        role: 'Medical Professional',
        content: 'A reliable platform for long-term wealth building. Their professional staff and clear documentation give me complete peace of mind.',
        rating: 5,
        location: 'Kanyakumari'
    }
];

export default function TestimonialsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-advance carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((current) => (current + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="testimonials" className="py-20 bg-white overflow-hidden" ref={ref}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2
                    className="text-4xl md:text-5xl font-bold text-center text-[#0A1F44] mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    What Our{' '}
                    <span className="bg-gradient-to-r from-[#FFD700] to-[#B8860B] bg-clip-text text-transparent">
                        Investors Say
                    </span>
                </motion.h2>

                <div className="relative">
                    {/* Background Quote Icon */}
                    <Quote className="absolute -top-10 -left-10 text-gray-100 w-40 h-40 -z-0" />

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <div className="flex flex-col items-center">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                                className="text-center"
                            >
                                <div className="flex justify-center mb-6">
                                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                                        <Star key={i} className="text-[#FFD700] fill-[#FFD700]" size={24} />
                                    ))}
                                </div>

                                <p className="text-2xl md:text-3xl italic text-[#0A1F44] mb-8 leading-relaxed">
                                    "{testimonials[activeIndex].content}"
                                </p>

                                <div>
                                    <h4 className="text-xl font-bold text-[#0A1F44]">{testimonials[activeIndex].name}</h4>
                                    <p className="text-gray-500">{testimonials[activeIndex].role} • {testimonials[activeIndex].location}</p>
                                </div>
                            </motion.div>

                            {/* Carousel Indicators */}
                            <div className="flex gap-2 mt-12">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveIndex(index)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === index ? 'w-8 bg-[#FFD700]' : 'bg-gray-200'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
