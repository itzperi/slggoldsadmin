'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { signIn, redirectAfterLogin } from '@/lib/supabase/client';

export default function LoginPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'admin' | 'staff'>('admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // DEMO BYPASS INTERCEPTOR
        if (email === 'admin@slggolds.com' && password === '1234@') {
            localStorage.setItem('admin_bypass', 'true');
            router.push('/admin');
            return;
        }

        if ((email === 'office@slggolds.com' || email === 'office') && password === '1234@') {
            localStorage.setItem('office_bypass', 'true');
            router.push('/office');
            return;
        }

        try {
            const { data, error: signInError } = await signIn(email, password);

            if (signInError) {
                setError('Invalid email or password. Please try again.');
                setIsLoading(false);
                return;
            }

            if (!data.user) {
                setError('Login failed. Please try again.');
                setIsLoading(false);
                return;
            }

            // Get redirect URL based on role
            try {
                const redirectUrl = await redirectAfterLogin(data.user.id);
                router.push(redirectUrl);
            } catch (redirectError: any) {
                setError(redirectError.message);
                setIsLoading(false);
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                background: 'linear-gradient(135deg, #0A1F44 0%, #1a0f3e 50%, #0a051a 100%)',
            }}
        >
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-[#FFD700] rounded-full opacity-20"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
                {/* Left: Brand Visual */}
                <motion.div
                    className="hidden md:block text-center"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="text-6xl font-bold bg-gradient-to-r from-[#FFD700] to-[#B8860B] bg-clip-text text-transparent mb-6">
                        SLG Golds
                    </div>
                    <p className="text-xl text-white/70 mb-8">
                        Secure Access to Your Investment Portal
                    </p>

                    {/* Animated Gold Coins */}
                    <div className="relative w-full h-64 flex items-center justify-center">
                        <motion.div
                            className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] shadow-2xl"
                            animate={{
                                y: [0, -15, 0],
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                        <motion.div
                            className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-[#C0C0C0] to-[#A8A8A8] shadow-2xl"
                            style={{ top: '10%', right: '30%' }}
                            animate={{
                                y: [0, -10, 0],
                                rotate: [0, -360],
                            }}
                            transition={{
                                duration: 3.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.5,
                            }}
                        />
                    </div>
                </motion.div>

                {/* Right: Login Form */}
                <motion.div
                    className="bg-white rounded-2xl shadow-2xl p-8"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl font-bold text-[#0A1F44] mb-6 text-center">
                        Welcome Back
                    </h2>

                    {/* Role Selector Tabs */}
                    <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('admin')}
                            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'admin'
                                ? 'bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-[#0A1F44] shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Admin
                        </button>
                        <button
                            onClick={() => setActiveTab('staff')}
                            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'staff'
                                ? 'bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-[#0A1F44] shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Office Staff
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                            <p className="text-red-700 text-sm">{error}</p>
                        </motion.div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all"
                                placeholder={
                                    activeTab === 'admin'
                                        ? 'admin@slggolds.com'
                                        : 'office@slggolds.com'
                                }
                                required
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none transition-all pr-12"
                                    placeholder="••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-[#0A1F44] font-bold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isLoading ? 'Logging in...' : 'Access Dashboard'}
                        </button>

                        <div className="text-center">
                            <a
                                href="#"
                                className="text-sm text-[#0A1F44] hover:text-[#FFD700] transition-colors"
                            >
                                Forgot your password?
                            </a>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                        <a
                            href="/"
                            className="text-sm text-gray-600 hover:text-[#FFD700] transition-colors"
                        >
                            ← Back to Home
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
