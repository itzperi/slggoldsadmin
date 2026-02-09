'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '#home', label: 'Home' },
        { href: '#benefits', label: 'Benefits' },
        { href: '#how-it-works', label: 'How It Works' },
        { href: '#features', label: 'Features' },
        { href: '#contact', label: 'Contact' },
    ];

    return (
        <header
            suppressHydrationWarning
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-[#0A1F44] shadow-lg'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#B8860B] bg-clip-text text-transparent">
                            SLG Golds
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-white hover:text-[#FFD700] transition-colors duration-200 font-medium"
                            >
                                {link.label}
                            </a>
                        ))}
                        <Link
                            href="/login"
                            className="px-6 py-2 bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-[#0A1F44] font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                        >
                            Login
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-white p-2"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-[#0A1F44] border-t border-[#FFD700]/20">
                    <nav className="px-4 py-6 space-y-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-white hover:text-[#FFD700] transition-colors duration-200 font-medium py-2"
                            >
                                {link.label}
                            </a>
                        ))}
                        <Link
                            href="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block w-full px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-[#0A1F44] font-bold rounded-lg text-center hover:shadow-lg transition-all duration-200"
                        >
                            Login
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
