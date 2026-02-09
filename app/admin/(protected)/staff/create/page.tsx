'use client';

import { useState } from 'react';
// import { createStaffAction } from '@/actions/staff'; // Removed unused action
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateStaffForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<{ username: string; password: string } | null>(null);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

    async function handleSubmit(formData: FormData) {
        if (loading) return; // Prevent double submission
        setLoading(true);
        setGlobalError(null);
        setFieldErrors({});
        setSuccess(null);

        const rawData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/admin/staff/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rawData),
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle known API errors
                if (result.error) {
                    if (typeof result.error === 'object' && !result.message) {
                        setFieldErrors(result.error);
                    } else {
                        setGlobalError(result.error);
                    }
                } else {
                    setGlobalError(`Server Error: ${response.status} ${response.statusText}`);
                }

                // Do NOT retry automatically. 
                // The user must manually correct inputs or config and click "Create" again.
            } else {
                setSuccess({
                    username: result.data?.username || (formData.get('username') as string),
                    password: result.data?.password || (formData.get('password') as string)
                });

                // Clear form or redirect
                setTimeout(() => {
                    router.push('/admin/staff/manage');
                }, 3000);
            }
        } catch (err: any) {
            console.error("Submission Error:", err);
            // Check for specific network errors that might mislead
            if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
                setGlobalError("Network Error: Could not reach the server. Please check your connection.");
            } else {
                setGlobalError(`Submission Failed: ${err.message || "Unknown error"}`);
            }
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="p-8 max-w-2xl text-white">
                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl flex flex-col items-center text-center">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Staff Created Successfully!</h2>
                    <p className="text-gray-300 mb-4">
                        Staff created successfully. Username: <span className="font-mono text-white bg-white/10 px-2 py-1 rounded">{success.username}</span>. Password: <span className="font-mono text-white bg-white/10 px-2 py-1 rounded">{success.password}</span>. They can now log in to the app.
                    </p>
                    <p className="text-sm text-gray-400 mb-6">
                        Redirecting to Manage Staff in a few seconds...
                    </p>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => setSuccess(null)}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                        >
                            Create Another
                        </Button>
                        <Link href="/admin/staff/manage">
                            <Button className="bg-green-600 hover:bg-green-700 text-white">
                                Go to Manage Staff
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-2xl text-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                Create Staff Account
            </h2>

            {globalError && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg mb-6 flex items-center gap-3 text-red-200">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{globalError}</p>
                </div>
            )}

            <form action={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400">Full Name</label>
                        <input
                            name="name"
                            required
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
                            placeholder="e.g. John Agent"
                        />
                        {fieldErrors.name && <p className="text-xs text-red-400">{fieldErrors.name[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400">Staff Code</label>
                        <input
                            name="staff_code"
                            required
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
                            placeholder="e.g. ST005"
                        />
                        {fieldErrors.staff_code && <p className="text-xs text-red-400">{fieldErrors.staff_code[0]}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400">Username</label>
                        <input
                            name="username"
                            required
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
                            placeholder="login_username"
                        />
                        {fieldErrors.username && <p className="text-xs text-red-400">{fieldErrors.username[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                        {fieldErrors.password && <p className="text-xs text-red-400">{fieldErrors.password[0]}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400">Phone</label>
                        <input
                            name="phone"
                            required
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
                            placeholder="+91..."
                        />
                        {fieldErrors.phone && <p className="text-xs text-red-400">{fieldErrors.phone[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400">Email <span className="text-gray-500 text-xs">(Optional)</span></label>
                        <input
                            name="email"
                            type="email"
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
                            placeholder="email@example.com"
                        />
                        {fieldErrors.email && <p className="text-xs text-red-400">{fieldErrors.email[0]}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400">Status</label>
                        <select
                            name="status"
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
                        >
                            <option value="active" className="text-black">Active</option>
                            <option value="inactive" className="text-black">Inactive</option>
                        </select>
                        {fieldErrors.status && <p className="text-xs text-red-400">{fieldErrors.status[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400">Default Route <span className="text-gray-500 text-xs">(Optional)</span></label>
                        <input
                            name="default_route_id"
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
                            placeholder="Route ID (UUID)"
                        />
                        {fieldErrors.default_route_id && <p className="text-xs text-red-400">{fieldErrors.default_route_id[0]}</p>}
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold h-12 text-lg disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Creating Staff...
                        </>
                    ) : (
                        'Create Account & Enable Login'
                    )}
                </Button>
            </form>
        </div>
    );
};
