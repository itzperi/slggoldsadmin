'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0A1F44] text-white py-16" suppressHydrationWarning>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    {/* Column 1: Company */}
                    <div>
                        <h3 className="text-[#FFD700] font-bold text-lg mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                                    Our Story
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Investment */}
                    <div>
                        <h3 className="text-[#FFD700] font-bold text-lg mb-4">Investment</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                                    Gold Schemes
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                                    Silver Schemes
                                </a>
                            </li>
                            <li>
                                <a href="#how-it-works" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                                    How It Works
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Support */}
                    <div>
                        <h3 className="text-[#FFD700] font-bold text-lg mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                                    Terms & Conditions
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                                    Refund Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Connect */}
                    <div>
                        <h3 className="text-[#FFD700] font-bold text-lg mb-4">Connect</h3>
                        <ul className="space-y-2 mb-4">
                            <li className="flex items-center gap-2">
                                <Phone size={16} className="text-[#FFD700]" />
                                <a
                                    href="tel:+91XXXXXXXXXX"
                                    className="text-gray-300 hover:text-[#FFD700] transition-colors"
                                >
                                    +91-XXXXXXXXXX
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={16} className="text-[#FFD700]" />
                                <a
                                    href="mailto:info@slggolds.com"
                                    className="text-gray-300 hover:text-[#FFD700] transition-colors"
                                >
                                    info@slggolds.com
                                </a>
                            </li>
                        </ul>

                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FFD700] hover:scale-110 transition-all duration-200"
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FFD700] hover:scale-110 transition-all duration-200"
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FFD700] hover:scale-110 transition-all duration-200"
                            >
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 text-center">
                    <p className="text-gray-400">
                        © {currentYear} SLG Thangangal. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
