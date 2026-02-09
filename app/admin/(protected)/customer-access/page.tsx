'use client';
import { useState } from 'react';
import { ShieldCheck, Smartphone, Send, ArrowRight, UserPlus, CheckCircle, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CustomerAccess() {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCreationForm, setShowCreationForm] = useState(false);
    const [searchResult, setSearchResult] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        full_name: '',
        aadhaar_number: '',
        password: '',
        // Extras
        gender: 'male',
        dob: '',
        father_spouse_name: '',
        address: '',
        area_branch: '',
        landmark: '',
        business_address: '',

        // Nominee
        nominee_name: '',
        nominee_relationship: '',
        nominee_phone: '',
        nominee_age: '',

        // Scheme
        scheme_type: '',
        scheme_number: '',
        payment_mode: '',
        scheme_amount: '',
        scheme_start_date: '',

        // Admin
        sales_officer_id: '',
        sales_officer_name: '',
        book_number: ''
    });

    const checkCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSearchResult(null);
        setShowCreationForm(false);

        try {
            // First, try attempting to "access" (check existence)
            // We reuse the existing endpoint or a lightweight check.
            // Existing endpoint returns 404 if not found.
            const res = await fetch('/api/admin/customers/access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customer_phone: phone })
            });

            const result = await res.json();
            const rpcResult = Array.isArray(result) ? result[0] : result;

            if (res.ok && rpcResult?.success) {
                // Customer exists and was updated/found
                setSearchResult({ success: true, message: rpcResult.message || "Customer access enabled." });
            } else if (res.status === 404) {
                // NOT FOUND -> SHOW FORM
                setShowCreationForm(true);
            } else {
                // Other error
                throw new Error(rpcResult?.message || result?.error || "Lookup failed");
            }

        } catch (error: any) {
            // If it's a generic error, show alert. If it's 404 logic caught here? 
            // The fetch block handles 404 response status.
            // If fetch itself failed (network), alert.
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreation = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                phone: phone, // Use the searched phone
                password: formData.password || 'password123' // Default or input
            };

            const res = await fetch('/api/admin/customers/create-full', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error || 'Creation failed');

            alert('✅ Customer Created Successfully!');
            // Reset
            setShowCreationForm(false);
            setPhone('');
            setFormData({
                full_name: '',
                aadhaar_number: '',
                password: '',
                // Extras
                gender: 'male',
                dob: '',
                father_spouse_name: '',
                address: '',
                area_branch: '',
                landmark: '',
                business_address: '',

                // Nominee
                nominee_name: '',
                nominee_relationship: '',
                nominee_phone: '',
                nominee_age: '',

                // Scheme
                scheme_type: '',
                scheme_number: '',
                payment_mode: '',
                scheme_amount: '',
                scheme_start_date: '',

                // Admin
                sales_officer_id: '',
                sales_officer_name: '',
                book_number: ''
            });

        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in max-w-4xl mx-auto py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <h1 className="text-3xl md:text-4xl font-bold gold-gradient uppercase tracking-tight font-black">App Access Control</h1>
            </div>

            {/* SEARCH SECTION */}
            {!showCreationForm && !searchResult && (
                <div className="glass p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                                <Smartphone className="text-yellow-500" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Enable Mobile Access</h2>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Search or Create Customer</p>
                            </div>
                        </div>

                        <form onSubmit={checkCustomer} className="space-y-6">
                            <div className="relative">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Customer Phone</label>
                                <input
                                    placeholder="+91XXXXXXXXXX"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none transition-all text-xl font-bold tracking-widest placeholder:text-white/5"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-yellow-500 text-black font-black py-4 rounded-xl hover:bg-yellow-400 transition-all uppercase tracking-widest flex items-center justify-center gap-3"
                            >
                                {loading ? 'CHECKING...' : 'SEARCH / ACTIVATE'} <ArrowRight size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* SUCCESS RESULT */}
            {searchResult && (
                <div className="glass p-8 rounded-3xl border border-green-500/30 bg-green-500/10 text-center">
                    <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                    <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
                    <p className="text-green-200 mb-6">{searchResult.message}</p>
                    <button onClick={() => { setSearchResult(null); setPhone(''); }} className="bg-white/10 px-6 py-2 rounded-full text-sm font-bold hover:bg-white/20 transition">Check Another</button>
                </div>
            )}

            {/* CREATION FORM */}
            {showCreationForm && (
                <div className="glass p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <UserPlus className="text-blue-500" size={24} />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">New Customer Registration</h2>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Phone: {phone} (Available)</p>
                        </div>
                        <button onClick={() => setShowCreationForm(false)} className="text-xs text-red-400 font-bold uppercase hover:text-red-300">Cancel</button>
                    </div>

                    <form onSubmit={handleCreation} className="space-y-6">
                        {/* 1. Personal */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-yellow-500 uppercase tracking-widest mb-4">Personal Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Full Name *" value={formData.full_name} onChange={v => setFormData({ ...formData, full_name: v })} required />
                                <Input label="Aadhaar Number *" value={formData.aadhaar_number} onChange={v => setFormData({ ...formData, aadhaar_number: v })} required />
                                <Input label="Father/Spouse Name" value={formData.father_spouse_name} onChange={v => setFormData({ ...formData, father_spouse_name: v })} />
                                <Input label="Date of Birth" type="date" value={formData.dob} onChange={v => setFormData({ ...formData, dob: v })} />
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none text-sm font-bold"
                                    >
                                        <option value="male" className="bg-neutral-900">Male</option>
                                        <option value="female" className="bg-neutral-900">Female</option>
                                        <option value="other" className="bg-neutral-900">Other</option>
                                    </select>
                                </div>
                            </div>
                            <Input label="Residential Address" value={formData.address} onChange={v => setFormData({ ...formData, address: v })} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Area / Branch" value={formData.area_branch} onChange={v => setFormData({ ...formData, area_branch: v })} />
                                <Input label="Landmark" value={formData.landmark} onChange={v => setFormData({ ...formData, landmark: v })} />
                            </div>
                            <Input label="Business Address" value={formData.business_address} onChange={v => setFormData({ ...formData, business_address: v })} />
                        </div>

                        {/* 2. Nominee */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h3 className="text-xs font-black text-yellow-500 uppercase tracking-widest mb-4">Nominee</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Nominee Name" value={formData.nominee_name} onChange={v => setFormData({ ...formData, nominee_name: v })} />
                                <Input label="Relationship" value={formData.nominee_relationship} onChange={v => setFormData({ ...formData, nominee_relationship: v })} />
                                <Input label="Nominee Phone" value={formData.nominee_phone} onChange={v => setFormData({ ...formData, nominee_phone: v })} />
                                <Input label="Nominee Age" type="number" value={formData.nominee_age} onChange={v => setFormData({ ...formData, nominee_age: v })} />
                            </div>
                        </div>

                        {/* 3. Scheme Details */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h3 className="text-xs font-black text-yellow-500 uppercase tracking-widest mb-4">Scheme Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Scheme Type" value={formData.scheme_type} onChange={v => setFormData({ ...formData, scheme_type: v })} />
                                <Input label="Scheme Number" value={formData.scheme_number} onChange={v => setFormData({ ...formData, scheme_number: v })} />
                                <Input label="Payment Mode" value={formData.payment_mode} onChange={v => setFormData({ ...formData, payment_mode: v })} />
                                <Input label="Installment Amount" type="number" value={formData.scheme_amount} onChange={v => setFormData({ ...formData, scheme_amount: v })} />
                                <Input label="Start Date" type="date" value={formData.scheme_start_date} onChange={v => setFormData({ ...formData, scheme_start_date: v })} />
                            </div>
                        </div>

                        {/* 4. App Access */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h3 className="text-xs font-black text-green-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Smartphone size={14} /> App Access Credentials
                            </h3>
                            <div className="bg-green-500/5 border border-green-500/10 p-4 rounded-xl">
                                <Input label="Set App Password *" type="text" value={formData.password} onChange={v => setFormData({ ...formData, password: v })} required placeholder="Min 8 characters" />
                            </div>
                        </div>

                        {/* 5. Office Use */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Office Use (Optional)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input label="Sales Officer ID" value={formData.sales_officer_id} onChange={v => setFormData({ ...formData, sales_officer_id: v })} />
                                <Input label="Sales Officer Name" value={formData.sales_officer_name} onChange={v => setFormData({ ...formData, sales_officer_name: v })} />
                                <Input label="Book Number" value={formData.book_number} onChange={v => setFormData({ ...formData, book_number: v })} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-500 text-white font-black py-4 rounded-xl hover:bg-green-400 transition-all uppercase tracking-widest flex items-center justify-center gap-3 mt-8 shadow-lg shadow-green-500/20"
                        >
                            {loading ? 'CREATING...' : 'CREATE CUSTOMER & ENABLE LOGIN'} <ShieldCheck size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

function Input({ label, value, onChange, required = false, type = "text", placeholder = "" }: { label: string, value: string, onChange: (v: string) => void, required?: boolean, type?: string, placeholder?: string }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{label}</label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                required={required}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none transition-all text-sm font-bold placeholder:text-white/10"
            />
        </div>
    );
}
