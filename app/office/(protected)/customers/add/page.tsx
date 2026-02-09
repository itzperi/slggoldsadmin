'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { User, MapPin, Shield, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const steps = [
    { id: 1, title: 'Personal', icon: User },
    { id: 2, title: 'Address', icon: MapPin },
    { id: 3, title: 'Nominee', icon: Shield },
    { id: 4, title: 'Review', icon: CheckCircle },
];

export default function AddCustomerWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '+91',
        address: '',
        nominee_name: '',
        nominee_relationship: '',
        id_type: 'aadhaar',
        id_number: '',
        enable_login: true
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // 1. Create Profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .insert({
                    full_name: formData.name,
                    phone: formData.phone,
                    role: 'customer',
                    login_method: 'phone_otp'
                })
                .select()
                .single();

            if (profileError) throw profileError;

            // 2. Create Customer Record
            const { error: customerError } = await supabase
                .from('customers')
                .insert({
                    user_id: profile.id,
                    full_name: formData.name,
                    phone: formData.phone,
                    login_phone: formData.enable_login ? formData.phone : null,
                    login_enabled: formData.enable_login,
                    address: formData.address,
                    nominee_name: formData.nominee_name,
                    nominee_relationship: formData.nominee_relationship,
                    identity_proof_type: formData.id_type,
                    identity_proof_number: formData.id_number
                });

            if (customerError) throw customerError;

            alert('Customer enrolled successfully!');
            router.push('/office/dashboard');
        } catch (err: any) {
            alert('Failed to enroll customer: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="flex justify-between items-center mb-12">
                {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center flex-1 relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${currentStep >= step.id ? 'bg-yellow-500 text-black' : 'bg-white/10 text-gray-400'
                            }`}>
                            <step.icon size={20} />
                        </div>
                        <span className={`text-[10px] mt-2 font-bold uppercase tracking-wider transition-colors ${currentStep >= step.id ? 'text-yellow-500' : 'text-gray-500'
                            }`}>
                            {step.title}
                        </span>
                        {step.id < steps.length && (
                            <div className={`absolute h-[2px] top-5 left-1/2 w-full -z-0 transition-all duration-500 ${currentStep > step.id ? 'bg-yellow-500' : 'bg-white/10'
                                }`} />
                        )}
                    </div>
                ))}
            </div>

            <div className="glass p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">Personal Details</h2>
                                <Field label="Full Name" value={formData.name} onChange={(v: string) => setFormData({ ...formData, name: v })} placeholder="Enter customer's full legal name" />
                                <Field label="Phone Number" value={formData.phone} onChange={(v: string) => setFormData({ ...formData, phone: v })} placeholder="+91XXXXXXXXXX" />
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">Contact & Address</h2>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Permanent Address</label>
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none transition-all min-h-[120px]"
                                        placeholder="Enter full residential address"
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">Nominee & Identity</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Nominee Name" value={formData.nominee_name} onChange={(v: string) => setFormData({ ...formData, nominee_name: v })} />
                                    <Field label="Relationship" value={formData.nominee_relationship} onChange={(v: string) => setFormData({ ...formData, nominee_relationship: v })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">ID Proof Type</label>
                                        <select
                                            value={formData.id_type}
                                            onChange={(e) => setFormData({ ...formData, id_type: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                                        >
                                            <option value="aadhaar">Aadhaar Card</option>
                                            <option value="pan">PAN Card</option>
                                            <option value="voter_id">Voter ID</option>
                                        </select>
                                    </div>
                                    <Field label="ID Number" value={formData.id_number} onChange={(v: string) => setFormData({ ...formData, id_number: v })} />
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">Final Review</h2>
                                <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-2xl p-6 space-y-4">
                                    <ReviewItem label="Customer" value={formData.name} />
                                    <ReviewItem label="Phone" value={formData.phone} />
                                    <ReviewItem label="Nominee" value={formData.nominee_name} />
                                    <ReviewItem label="ID" value={`${formData.id_type.toUpperCase()}: ${formData.id_number}`} />
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
                                    <input
                                        type="checkbox"
                                        checked={formData.enable_login}
                                        onChange={(e) => setFormData({ ...formData, enable_login: e.target.checked })}
                                        className="w-5 h-5 rounded accent-green-500"
                                    />
                                    <div>
                                        <div className="text-sm font-bold text-white">ACTIVATE MOBILE APP ACCESS</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">INSTANT OTP LOGIN FOR CUSTOMER</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="flex justify-between mt-12">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1 || loading}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentStep === 1 ? 'opacity-0' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <ArrowLeft size={18} /> BACK
                    </button>

                    {currentStep < steps.length ? (
                        <button
                            onClick={nextStep}
                            className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-yellow-500/20"
                        >
                            CONTINUE <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-green-500 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-400 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-500/20 disabled:opacity-50"
                        >
                            {loading ? 'PROCESSING...' : 'COMPLETE ENROLLMENT'} <CheckCircle size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, type?: string }) {
    return (
        <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none transition-all placeholder:text-white/10"
            />
        </div>
    );
}

function ReviewItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
            <span className="text-white font-medium">{value}</span>
        </div>
    );
}
