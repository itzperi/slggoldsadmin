'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';
import { MapPin, Phone, Mail, CheckCircle } from 'lucide-react';

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    email: z.string().email('Invalid email address'),
    investment_interest: z.string().min(1, 'Please select an option'),
    message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        try {
            const { error } = await supabase.from('leads').insert([data]);

            if (error) throw error;

            setIsSuccess(true);
            reset();
            setTimeout(() => setIsSuccess(false), 5000);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-20 bg-white" ref={ref}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2
                    className="text-4xl md:text-5xl font-bold text-center text-[#0A1F44] mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    Get in{' '}
                    <span className="bg-gradient-to-r from-[#FFD700] to-[#B8860B] bg-clip-text text-transparent">
                        Touch with Us
                    </span>
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        {isSuccess ? (
                            <motion.div
                                className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
                                <h3 className="text-2xl font-bold text-green-700 mb-2">
                                    Thank You!
                                </h3>
                                <p className="text-green-600">
                                    We've received your inquiry. Our team will contact you soon.
                                </p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        {...register('name')}
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all"
                                        placeholder="Enter your full name"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        {...register('phone')}
                                        type="tel"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all"
                                        placeholder="+91-XXXXXXXXXX"
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        {...register('email')}
                                        type="email"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all"
                                        placeholder="your@email.com"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Investment Interest *
                                    </label>
                                    <select
                                        {...register('investment_interest')}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="Gold Scheme">Gold Scheme</option>
                                        <option value="Silver Scheme">Silver Scheme</option>
                                        <option value="Both">Both</option>
                                    </select>
                                    {errors.investment_interest && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.investment_interest.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message (Optional)
                                    </label>
                                    <textarea
                                        {...register('message')}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Tell us more about your investment goals..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-[#0A1F44] font-bold rounded-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                                </button>
                            </form>
                        )}
                    </motion.div>

                    {/* Office Details */}
                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-[#0A1F44] mb-6">
                                SLG Thangangal Head Office
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <MapPin className="text-[#FFD700] flex-shrink-0" size={24} />
                                    <div>
                                        <p className="text-gray-700">123 Gandhi Road, Nagercoil</p>
                                        <p className="text-gray-700">Tamil Nadu - 629001</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Phone className="text-[#FFD700] flex-shrink-0" size={24} />
                                    <a
                                        href="tel:+91XXXXXXXXXX"
                                        className="text-gray-700 hover:text-[#FFD700] transition-colors"
                                    >
                                        +91-XXXXXXXXXX
                                    </a>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Mail className="text-[#FFD700] flex-shrink-0" size={24} />
                                    <a
                                        href="mailto:info@slggolds.com"
                                        className="text-gray-700 hover:text-[#FFD700] transition-colors"
                                    >
                                        info@slggolds.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
                            <p className="text-gray-500">Google Maps Embed</p>
                        </div>

                        <a
                            href="https://maps.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-6 py-3 border-2 border-[#FFD700] text-[#FFD700] font-bold rounded-lg hover:bg-[#FFD700] hover:text-[#0A1F44] transition-all duration-200"
                        >
                            View on Google Maps
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
