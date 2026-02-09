'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    User, Phone, CreditCard, Users, MapPin,
    FileText, Shield, Save, ArrowLeft, Loader2
} from 'lucide-react';

export default function CreateCustomerPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        // Personal
        full_name: '',
        phone: '',
        password: '',
        aadhaar_number: '',
        dob: '',
        gender: 'male',

        // Address
        residential_address: '',
        landmark: '',
        area_branch: '',
        business_address: '',

        // Nominee
        father_or_spouse_name: '',
        nominee_name: '',
        nominee_relationship: '',
        nominee_age: '',

        // Scheme
        scheme_type: 'gold',
        scheme_number: '',
        payment_mode: 'monthly',
        installment_amount: '',
        scheme_start_date: new Date().toISOString().split('T')[0],

        // Office
        book_number: '',
        sales_officer_id: '',
        sales_officer_name: '',
        notes: '',
        status: 'active'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Normalize Phone: Ensure +91 checks
        // Currently sending as entered, assuming Admin puts 10 digits or +91. 
        // Best to enforce E.164 from UI or let backend handle simple cases. 
        // Let's ensure we send a clean string.

        try {
            const res = await fetch('/api/admin/customers/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Failed to create customer');
            }

            alert('✅ Customer Created Successfully!');
            router.push('/admin/customers');
        } catch (err: any) {
            setError(err.message);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ArrowLeft className="text-gray-400" size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">New Customer</h1>
                    <p className="text-gray-400 text-sm">Create a new customer profile with full access</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 flex items-center gap-3">
                    <Shield size={20} />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* 1. Personal & Access */}
                <section className="glass p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                        <User className="text-yellow-500" size={24} />
                        <h2 className="text-xl font-bold text-white uppercase">Personal & Login Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Input label="Full Name *" name="full_name" value={formData.full_name} onChange={handleChange} required />
                        <Input label="Phone (Login ID) *" name="phone" placeholder="+91..." value={formData.phone} onChange={handleChange} required />
                        <Input label="App Password *" name="password" type="password" value={formData.password} onChange={handleChange} required minLength={6} />

                        <Input label="Aadhaar Number *" name="aadhaar_number" value={formData.aadhaar_number} onChange={handleChange} required />
                        <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                        <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={['male', 'female', 'other']} />
                    </div>
                </section>

                {/* 2. Identity & Nominee */}
                <section className="glass p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                        <Users className="text-blue-500" size={24} />
                        <h2 className="text-xl font-bold text-white uppercase">Family & Nominee</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Input label="Father / Spouse Name" name="father_or_spouse_name" value={formData.father_or_spouse_name} onChange={handleChange} />
                        <Input label="Nominee Name" name="nominee_name" value={formData.nominee_name} onChange={handleChange} />
                        <Input label="Nominee Relationship" name="nominee_relationship" value={formData.nominee_relationship} onChange={handleChange} />
                        <Input label="Nominee Age" name="nominee_age" type="number" value={formData.nominee_age} onChange={handleChange} />
                    </div>
                </section>

                {/* 3. Address */}
                <section className="glass p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                        <MapPin className="text-green-500" size={24} />
                        <h2 className="text-xl font-bold text-white uppercase">Contact & Location</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Residential Address" name="residential_address" value={formData.residential_address} onChange={handleChange} className="md:col-span-2" />
                        <Input label="Area / Branch" name="area_branch" value={formData.area_branch} onChange={handleChange} />
                        <Input label="Landmark" name="landmark" value={formData.landmark} onChange={handleChange} />
                    </div>
                </section>

                {/* 4. Scheme & Payment */}
                <section className="glass p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                        <CreditCard className="text-purple-500" size={24} />
                        <h2 className="text-xl font-bold text-white uppercase">Scheme Details</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Select label="Scheme Type" name="scheme_type" value={formData.scheme_type} onChange={handleChange} options={['gold', 'silver', 'platinum']} />
                        <Input label="Scheme Number" name="scheme_number" value={formData.scheme_number} onChange={handleChange} />
                        <Select label="Payment Mode" name="payment_mode" value={formData.payment_mode} onChange={handleChange} options={['daily', 'weekly', 'monthly']} />
                        <Input label="Installment Amount" name="installment_amount" type="number" value={formData.installment_amount} onChange={handleChange} />
                        <Input label="Start Date" name="scheme_start_date" type="date" value={formData.scheme_start_date} onChange={handleChange} />
                        <Input label="Book Number" name="book_number" value={formData.book_number} onChange={handleChange} />
                    </div>
                </section>

                {/* 5. Office Use */}
                <section className="glass p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                        <FileText className="text-gray-500" size={24} />
                        <h2 className="text-xl font-bold text-white uppercase">Office Use</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input label="Sales Officer ID" name="sales_officer_id" value={formData.sales_officer_id} onChange={handleChange} />
                        <Input label="Sales Officer Name" name="sales_officer_name" value={formData.sales_officer_name} onChange={handleChange} />
                        <Select label="Status" name="status" value={formData.status} onChange={handleChange} options={['active', 'closed', 'pending']} />
                    </div>
                    <div className="mt-6">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Notes</label>
                        <textarea
                            name="notes"
                            rows={3}
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                        />
                    </div>
                </section>

                <div className="flex justify-end gap-4 pt-8">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold uppercase tracking-widest transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-black uppercase tracking-widest transition-all shadow-lg shadow-yellow-500/20 flex items-center gap-3"
                    >
                        {loading && <Loader2 className="animate-spin" size={20} />}
                        {loading ? 'Creating...' : 'Create Customer'}
                    </button>
                </div>

            </form>
        </div>
    );
}

// Reusable Components
function Input({ label, className = "", ...props }: any) {
    return (
        <div className={className}>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">{label}</label>
            <input
                {...props}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-yellow-500/50 outline-none transition-all placeholder:text-white/10"
            />
        </div>
    );
}

function Select({ label, options, className = "", ...props }: any) {
    return (
        <div className={className}>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">{label}</label>
            <select
                {...props}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-yellow-500/50 outline-none transition-all [&>option]:bg-gray-900"
            >
                {options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                ))}
            </select>
        </div>
    );
}
